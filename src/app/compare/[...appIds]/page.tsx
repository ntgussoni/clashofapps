"use client";

import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { useChat } from "@ai-sdk/react";

import type {
  AnalysisResultsData,
  ComparisonResultsData,
} from "@/components/types";

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
import { useParams } from "next/navigation";

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
  const [completed, setCompleted] = useState(false);
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
  const { handleSubmit, data } = useChat({
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
                  const appId = match[1].trim();
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
              (info) => info.appId === appInfo.appId,
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
          const result = dataItem as AnalysisResultsData & { type: string };
          setLoadingAnalysis(false);

          // Remove this app from loading state
          setLoadingAppIds((ids) => ids.filter((id) => id !== result.appName));

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
          const comparisonItem = dataItem as ComparisonResultsData & {
            type: string;
          };
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

      // Automatically submit the form with the app IDs
      handleSubmit(
        new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      );
    }
  }, [appIds, handleSubmit]);

  return (
    <div className="auto mx-auto flex w-full max-w-6xl flex-grow flex-col">
      {/* Status indicator */}
      <StatusIndicator currentStatus={currentStatus} completed={completed} />
      <div className="overflow-x-auto">
        {/* App Info Cards */}
        {(appInfos.length > 0 || loadingAppInfo) && (
          <div className="mb-8">
            <div className={`flex flex-row gap-4`}>
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
