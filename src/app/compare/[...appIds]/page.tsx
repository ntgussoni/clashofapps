"use client";

import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  type AppInfo,
  type AppAnalysis,
  type CompetitorAnalysis,
} from "@/server/review-analyzer/types";
import type {
  AnalysisResultsData,
  ComparisonResultsData,
} from "@/components/types";

// Import components
import AppInfoCard from "@/components/chat/AppInfoCard";
import AnalysisCard from "@/components/chat/AnalysisCard";
import ComparisonSection from "@/components/chat/ComparisonSection";
import FloatingInput from "@/components/chat/FloatingInput";
import StatusIndicator from "@/components/chat/StatusIndicator";
import { BrandIcon } from "@/components/ui/brand-icon";
import { siteConfig } from "@/lib/config";

// Import skeleton components
import SkeletonAppInfoCard from "@/components/chat/SkeletonAppInfoCard";
import SkeletonAnalysisCard from "@/components/chat/SkeletonAnalysisCard";
import SkeletonComparisonSection from "@/components/chat/SkeletonComparisonSection";
import { App } from "@prisma/client";

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
  | ({ type: "comparison_results" } & ComparisonResultsData);

// Memoized components to prevent unnecessary re-renders
const MemoizedAppInfoCard = memo(AppInfoCard);
const MemoizedAnalysisCard = memo(AnalysisCard);
const MemoizedSkeletonAppInfoCard = memo(SkeletonAppInfoCard);
const MemoizedSkeletonAnalysisCard = memo(SkeletonAnalysisCard);

export default function CompareApps() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [appInfos, setAppInfos] = useState<AppInfoWithIcon[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultsData[]>(
    [],
  );
  const [comparisonResults, setComparisonResults] =
    useState<ComparisonResultsData | null>(null);

  // Add state to track loading apps and specific loading states
  const [loadingAppIds, setLoadingAppIds] = useState<string[]>([]);
  const [loadingAppInfo, setLoadingAppInfo] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showComparisonSkeleton, setShowComparisonSkeleton] = useState(false);

  // For batching updates to prevent excessive re-renders
  const [pendingAppInfos, setPendingAppInfos] = useState<
    Record<string, AppInfoWithIcon>
  >({});
  const [pendingAnalysisResults, setPendingAnalysisResults] = useState<
    Record<string, AnalysisResultsData>
  >({});

  // Track processed data items to prevent duplicate processing
  const processedDataRef = useRef(new Set<string>());

  // Get app IDs from URL params
  const appIds = useMemo(() => {
    return Array.isArray(params.appIds)
      ? params.appIds
      : params.appIds
        ? [params.appIds]
        : [];
  }, [params.appIds]);

  // Use the useChat hook from Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "/api/chat",
      initialInput: appIds.join(", "),
      id: appIds.join("-"),
    });

  // Memoize the skeletons loading app list to prevent re-calculations
  const skeletonLoadingAppIds = useMemo(() => {
    if (!loadingAppInfo) return [];
    return loadingAppIds.filter(
      (id) => !appInfos.some((info) => info.appId === id),
    );
  }, [loadingAppInfo, loadingAppIds, appInfos]);

  // Memoize the analysis skeleton loading list
  const skeletonAnalysisAppIds = useMemo(() => {
    if (!loadingAnalysis) return [];
    return loadingAppIds.filter(
      (id) => !analysisResults.some((result) => result.appName === id),
    );
  }, [loadingAnalysis, loadingAppIds, analysisResults]);

  // Batch update function for app infos - to reduce re-renders
  const flushPendingAppInfos = useCallback(() => {
    setPendingAppInfos((current) => {
      if (Object.keys(current).length === 0) return current;

      setAppInfos((prev) => {
        const updatedAppInfos = [...prev];
        const newAppInfos: AppInfoWithIcon[] = [];

        Object.values(current).forEach((appInfo) => {
          const existingIndex = updatedAppInfos.findIndex(
            (info) => info.appId === appInfo.appId,
          );
          if (existingIndex >= 0) {
            updatedAppInfos[existingIndex] = appInfo;
          } else {
            newAppInfos.push(appInfo);
          }
        });

        return [...updatedAppInfos, ...newAppInfos];
      });

      return {};
    });
  }, []);

  // Batch update function for analysis results - to reduce re-renders
  const flushPendingAnalysisResults = useCallback(() => {
    setPendingAnalysisResults((current) => {
      if (Object.keys(current).length === 0) return current;

      setAnalysisResults((prev) => {
        const updatedResults = [...prev];
        const newResults: AnalysisResultsData[] = [];

        Object.values(current).forEach((result) => {
          const existingIndex = updatedResults.findIndex(
            (r) => r.appName === result.appName,
          );
          if (existingIndex >= 0) {
            updatedResults[existingIndex] = result;
          } else {
            newResults.push(result);
          }
        });

        return [...updatedResults, ...newResults];
      });

      return {};
    });
  }, []);

  // Set up flush interval for batched updates
  useEffect(() => {
    const flushInterval = setInterval(() => {
      flushPendingAppInfos();
      flushPendingAnalysisResults();
    }, 300); // Batch updates every 300ms

    return () => clearInterval(flushInterval);
  }, [flushPendingAppInfos, flushPendingAnalysisResults]);

  // Process stream data when it arrives - using useCallback to memoize the handler
  const processDataItem = useCallback(
    (item: unknown) => {
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
                    const appId = match[1].trim();
                    setLoadingAppIds((prev) => {
                      if (!prev.includes(appId)) {
                        return [...prev, appId];
                      }
                      return prev;
                    });
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
                setShowComparisonSkeleton(false);

                // Final flush of pending updates
                flushPendingAppInfos();
                flushPendingAnalysisResults();
              }
            }
            break;
          }
          case "app_info": {
            // Batch app info updates instead of immediate state update
            const appInfo = dataItem as AppInfoWithIcon;
            setLoadingAppInfo(false);

            setPendingAppInfos((prev) => {
              // Skip if this app info already exists in the main state
              if (appInfos.some((info) => info.appId === appInfo.appId)) {
                return prev;
              }
              return { ...prev, [appInfo.appId]: appInfo };
            });

            break;
          }
          case "analysis_results": {
            // Batch analysis results updates
            const result = dataItem as AnalysisResultsData & { type: string };
            setLoadingAnalysis(false);

            // Remove this app from loading state completely
            setLoadingAppIds((ids) =>
              ids.filter((id) => id !== result.appName),
            );

            setPendingAnalysisResults((prev) => {
              return { ...prev, [result.appName]: result };
            });

            break;
          }
          case "comparison_results": {
            // Set comparison results
            const comparisonItem = dataItem as ComparisonResultsData & {
              type: string;
            };
            setComparisonResults(comparisonItem);
            setShowComparisonSkeleton(false);
            break;
          }
        }
      }
    },
    [appInfos, flushPendingAppInfos, flushPendingAnalysisResults],
  );

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

  // Auto-submit the form when the component mounts and we have app IDs
  useEffect(() => {
    if (appIds.length > 0) {
      // Set loading states based on what we're doing
      setLoadingAppInfo(true);
      setLoadingAnalysis(true);
      setLoadingAppIds(appIds);

      // Show comparison skeleton only if multiple apps
      if (appIds.length > 1) {
        setShowComparisonSkeleton(true);
      }

      // Clear processed data items when submitting a new request
      processedDataRef.current.clear();

      // Reset all state
      setAppInfos([]);
      setAnalysisResults([]);
      setComparisonResults(null);
      setPendingAppInfos({});
      setPendingAnalysisResults({});

      // Automatically submit the form with the app IDs
      // Use a type assertion to unknown first to avoid type errors
      handleSubmit(
        new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      );
    }
  }, [appIds, handleSubmit]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col">
      {/* Status indicator */}
      <StatusIndicator currentStatus={currentStatus} />

      {/* App Info Cards */}
      {(appInfos.length > 0 || loadingAppInfo) && (
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Actual app info cards */}
            {appInfos.map((appInfo) => (
              <MemoizedAppInfoCard key={appInfo.appId} appInfo={appInfo} />
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
          <div className="overflow-x-auto">
            <div className="flex min-w-full space-x-6 pb-2">
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

      {/* Cross-App Comparison Section */}
      {comparisonResults && (
        <ComparisonSection comparisonResults={comparisonResults} />
      )}

      {/* Skeleton Comparison Section */}
      {showComparisonSkeleton && !comparisonResults && (
        <SkeletonComparisonSection />
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="mb-4 flex-grow space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-3xl rounded-xl rounded-br-none bg-blue-500 p-4 text-white">
                <div className="prose dark:prose-invert prose-sm sm:prose-base">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
