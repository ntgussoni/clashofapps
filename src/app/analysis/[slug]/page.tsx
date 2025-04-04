"use client";

import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  RefreshCw,
  CreditCard,
  Lock,
  FileSearch,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import type { AnalysisResultsData, ComparisonData } from "@/types";

// Import components
import AppInfoCard from "@/components/chat/AppInfoCard";
import AnalysisCard from "@/components/chat/AnalysisCard";
import ComparisonSection from "@/components/chat/ComparisonSection";
import StatusIndicator from "@/components/chat/StatusIndicator";

// Import skeleton components
import SkeletonAppInfoCard from "@/components/chat/SkeletonAppInfoCard";
import SkeletonAnalysisCard from "@/components/chat/SkeletonAnalysisCard";
import SkeletonComparisonSection from "@/components/chat/SkeletonComparisonSection";
import { type App } from "@prisma/client";

// Define types for the data stream items
type StatusDataItem = {
  type: "status";
  status: "analyzing" | "summarizing" | "completed" | "error";
  message: string;
};

// Extend the AppInfo type to match what comes from the server
interface AppInfoWithIcon extends App {
  type: "app_info";
}

// Type for the data we receive from the server
type DataItem =
  | StatusDataItem
  | ({ type: "app_info" } & AppInfoWithIcon)
  | ({ type: "analysis_results" } & AnalysisResultsData)
  | ({ type: "comparison_results" } & ComparisonData);

// Define error types to match API responses
type ApiError = {
  status: number;
  message: string;
  error: string;
};

// Memoized components to prevent unnecessary re-renders
const MemoizedAppInfoCard = memo(AppInfoCard);
const MemoizedAnalysisCard = memo(AnalysisCard);
const MemoizedSkeletonAppInfoCard = memo(SkeletonAppInfoCard);
const MemoizedSkeletonAnalysisCard = memo(SkeletonAnalysisCard);

export default function AnalysisPage() {
  const params = useParams();
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [appInfos, setAppInfos] = useState<AppInfoWithIcon[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultsData[]>(
    [],
  );
  const [comparisonResults, setComparisonResults] =
    useState<ComparisonData | null>(null);

  // Add error state
  const [error, setError] = useState<ApiError | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Add state to track loading apps and specific loading states
  const [loadingAppIds, setLoadingAppIds] = useState<number[]>([]);
  const [loadingAppInfo, setLoadingAppInfo] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showComparisonSkeleton, setShowComparisonSkeleton] = useState(false);
  const [completed, setCompleted] = useState(false);
  // Track processed data items to prevent duplicate processing
  const processedDataRef = useRef(new Set<string>());
  // Add this new ref to track form submissions
  const submittedAnalysisIdRef = useRef<string | null>(null);

  // Extract the analysis ID from the slug (the part after the last dash)
  const analysisId = useMemo(() => {
    if (!params.slug || typeof params.slug !== "string") return null;

    const parts = params.slug.split("-");
    return parts[parts.length - 1] ?? null;
  }, [params.slug]);

  // Use the useChat hook from Vercel AI SDK with error handling
  const { handleSubmit, data } = useChat({
    api: "/api/chat",
    initialInput: analysisId ?? "",
    body: {
      slug: params.slug,
    },
    onError: (error) => {
      // Parse error response
      try {
        const errorResponse = JSON.parse(error.message) as Record<
          string,
          unknown
        >;
        setError({
          status: (errorResponse.status as number) || 500,
          message:
            (errorResponse.message as string) || "An unknown error occurred",
          error: (errorResponse.error as string) || "Error",
        });
      } catch {
        // If parsing fails, use the raw error message
        setError({
          status: 500,
          message: error.message,
          error: "Error",
        });
      }
      setIsInitialLoading(false);
    },
    onFinish: () => {
      setIsInitialLoading(false);
    },
  });

  // Define a function to handle retrying the analysis
  const handleRetry = useCallback(() => {
    // Reset states
    setError(null);
    setAppInfos([]);
    setAnalysisResults([]);
    setComparisonResults(null);
    setCurrentStatus(null);
    setCompleted(false);
    processedDataRef.current.clear();
    setLoadingAppInfo(true);
    setLoadingAnalysis(true);
    setIsInitialLoading(true);

    // Resubmit the form
    handleSubmit(
      new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
    );
  }, [handleSubmit]);

  // Memoize the skeletons loading app list to prevent re-calculations
  const skeletonLoadingAppIds = useMemo(() => {
    if (!loadingAppInfo) return [];
    return loadingAppIds.filter(
      (id) => !appInfos.some((info) => info.id === id),
    );
  }, [loadingAppInfo, loadingAppIds, appInfos]);

  // Memoize the analysis skeleton loading list
  const skeletonAnalysisAppIds = useMemo(() => {
    if (!loadingAnalysis) return [];
    return loadingAppIds.filter(
      (id) => !analysisResults.some((result) => result.appId === id),
    );
  }, [loadingAnalysis, loadingAppIds, analysisResults]);

  // Process stream data when it arrives
  const processDataItem = useCallback((item: unknown) => {
    if (!item || typeof item !== "object") return;

    // Generate a unique ID for this data item to prevent duplicate processing
    const itemId = JSON.stringify(item);
    if (processedDataRef.current.has(itemId)) return;
    processedDataRef.current.add(itemId);

    // Try to cast to our DataItem type
    const dataItem = item as Partial<DataItem>;

    if (dataItem.type) {
      switch (dataItem.type) {
        case "status": {
          const statusItem = dataItem as StatusDataItem;
          if (statusItem.message) {
            setCurrentStatus(statusItem.message);

            // Check if we're starting to analyze apps
            if (statusItem.status === "analyzing") {
              const message = statusItem.message;

              // Show comparison skeleton only when explicitly generating comparison
              if (message.includes("Generating cross-app comparison")) {
                setShowComparisonSkeleton(true);
              }
              // Show app info skeleton when fetching app data
              else if (message.includes("Fetching data for app")) {
                setLoadingAppInfo(true);
                // Extract app ID from the message if possible
                const regex = /Fetching data for app\s+(.*?)\.\.\.$/;
                const match = regex.exec(message);
                if (match?.[1]) {
                  const appId = Number(match[1].trim());
                  setLoadingAppIds((prev) =>
                    !prev.includes(appId) ? [...prev, appId] : prev,
                  );
                }
              }
              // Show analysis skeleton when analyzing reviews
              else if (
                message.includes("Analyzing") &&
                message.includes("reviews")
              ) {
                setLoadingAnalysis(true);
              }
            } else if (statusItem.status === "completed") {
              // Clear all loading states when completed
              setLoadingAppIds([]);
              setLoadingAppInfo(false);
              setLoadingAnalysis(false);
              setCompleted(true);
              setShowComparisonSkeleton(false);
            } else if (statusItem.status === "error") {
              // Handle error status
              setError({
                status: 500,
                message: statusItem.message,
                error: "Error",
              });
              setIsInitialLoading(false);
            }
          }
          break;
        }
        case "app_info": {
          const appInfo = dataItem as AppInfoWithIcon;
          setLoadingAppInfo(false);
          // Only add if not already in the array
          setAppInfos((prev) => {
            const existingIndex = prev.findIndex(
              (info) => info.id === appInfo.id,
            );
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = appInfo;
              return updated;
            } else {
              return [...prev, appInfo];
            }
          });
          break;
        }
        case "analysis_results": {
          const result = dataItem as AnalysisResultsData & {
            type: string;
          };
          setLoadingAnalysis(false);

          // Remove this app from loading state
          setLoadingAppIds((ids) => ids.filter((id) => id !== result.appId));

          // Update analysis results
          setAnalysisResults((prev) => {
            const existingIndex = prev.findIndex(
              (r) => r.appName === result.appName,
            );
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = result;
              return updated;
            } else {
              return [...prev, result];
            }
          });
          break;
        }
        case "comparison_results": {
          const comparisonItem = dataItem as ComparisonData;
          setComparisonResults(comparisonItem);
          setShowComparisonSkeleton(false);
          break;
        }
      }
    }
  }, []);

  // Process data items when they arrive
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    // Clear processed items when new data comes in
    if (data.length === 0) {
      processedDataRef.current.clear();
      return;
    }

    // Process each data item
    data.forEach(processDataItem);
  }, [data, processDataItem]);

  // Fix the auto-submit useEffect to prevent infinite loops
  useEffect(() => {
    // Only submit if we have an analysisId and haven't submitted this ID yet
    if (analysisId && submittedAnalysisIdRef.current !== analysisId) {
      // Update the ref to mark this ID as submitted
      submittedAnalysisIdRef.current = analysisId;

      // Set loading states based on what we're doing
      setLoadingAppInfo(true);
      setLoadingAnalysis(true);
      setIsInitialLoading(true);
      setError(null);

      // Clear processed data items when submitting a new request
      processedDataRef.current.clear();

      // Reset all state
      setAppInfos([]);
      setAnalysisResults([]);
      setComparisonResults(null);

      // Automatically submit the form with the analysis ID
      handleSubmit(
        new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      );
    }
  }, [analysisId, handleSubmit]);

  // Show loading state or error if no analysisId
  if (!analysisId) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Invalid Analysis URL
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The analysis ID could not be found in the URL.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Render appropriate error messages based on error status
  if (error) {
    let errorContent;

    switch (error.status) {
      case 401:
        errorContent = (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="w-full max-w-md text-center">
              <Lock className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                Authentication Required
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please log in to view this analysis.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        );
        break;

      case 403:
        errorContent = (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="w-full max-w-md text-center">
              <Lock className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                Access Denied
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You don&apos;t have permission to view this analysis.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        );
        break;

      case 404:
        errorContent = (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="w-full max-w-md text-center">
              <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                Analysis Not Found
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                The analysis you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        );
        break;

      case 402:
        errorContent = (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="w-full max-w-md text-center">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                Not Enough Credits
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {error.message || "You need more credits to run this analysis."}
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Button asChild>
                  <Link href="/credits">Add Credits</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        );
        break;

      default:
        errorContent = (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="w-full max-w-md">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Processing Analysis</AlertTitle>
                <AlertDescription>
                  {error.message ||
                    "Something went wrong while analyzing the apps."}
                </AlertDescription>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Analysis
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        );
    }

    return errorContent;
  }

  // Zero state - when data is loading initially
  if (isInitialLoading && !appInfos.length && !analysisResults.length) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            App Analysis
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Starting analysis...</span>
          </div>
        </div>

        {/* App info skeletons */}
        <div className="mb-8">
          <div className="flex flex-row gap-4 overflow-x-auto pb-4">
            <MemoizedSkeletonAppInfoCard />
            <MemoizedSkeletonAppInfoCard />
          </div>
        </div>

        {/* Analysis skeletons */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            App Analysis
          </h3>
          <div className="flex flex-row gap-4 overflow-x-auto pb-4">
            <MemoizedSkeletonAnalysisCard />
            <MemoizedSkeletonAnalysisCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auto mx-auto flex w-full max-w-6xl flex-grow flex-col p-6">
      {/* Status indicator */}
      <StatusIndicator currentStatus={currentStatus} completed={completed} />

      {/* No data state */}
      {!isInitialLoading &&
        !error &&
        appInfos.length === 0 &&
        analysisResults.length === 0 && (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
              <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                No Analysis Data
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                There is no data available for this analysis.
              </p>
              <Button
                onClick={handleRetry}
                className="mt-4 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Analysis
              </Button>
            </div>
          </div>
        )}

      <div className="overflow-x-auto">
        {/* App Info Cards */}
        {(appInfos.length > 0 || loadingAppInfo) && (
          <div className="mb-8">
            <div className={`flex flex-row gap-4`}>
              {/* Actual app info cards */}
              {appInfos.map((appInfo) => (
                <MemoizedAppInfoCard key={appInfo.id} appInfo={appInfo} />
              ))}

              {/* Skeleton app info cards for loading apps */}
              {skeletonLoadingAppIds.map((appId) => (
                <MemoizedSkeletonAppInfoCard key={`skeleton-${appId}`} />
              ))}
            </div>
          </div>
        )}

        {/* Analysis Results - Always in columns with horizontal scroll */}
        {(analysisResults.length > 0 || loadingAnalysis) && (
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              App Analysis{" "}
              {analysisResults.length > 1
                ? `(${analysisResults.length} Apps)`
                : ""}
            </h3>
            <div>
              <div className={`flex flex-row gap-4`}>
                {/* For each app, show a column of analysis results */}
                {analysisResults.map((result, index) => (
                  <MemoizedAnalysisCard
                    key={`analysis-${result.appName}-${index}`}
                    result={result}
                  />
                ))}

                {/* Skeleton analysis cards for loading apps */}
                {skeletonAnalysisAppIds.map((appId) => (
                  <MemoizedSkeletonAnalysisCard
                    key={`skeleton-analysis-${appId}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cross-App Comparison Section */}
      {comparisonResults && (
        <ComparisonSection comparisonResults={comparisonResults} />
      )}

      {/* Skeleton Comparison Section */}
      {showComparisonSkeleton && !comparisonResults && (
        <SkeletonComparisonSection />
      )}
    </div>
  );
}
