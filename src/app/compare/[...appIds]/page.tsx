"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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

// Define types for the data stream items
type StatusDataItem = {
  type: "status";
  status: "analyzing" | "summarizing" | "completed" | "error";
  message: string;
};

type DataItem =
  | StatusDataItem
  | ({ type: "app_info" } & AppInfo)
  | ({ type: "analysis_results" } & AppAnalysis)
  | ({ type: "comparison_results" } & CompetitorAnalysis);

export default function CompareApps() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [appInfos, setAppInfos] = useState<AppInfo[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AppAnalysis[]>([]);
  const [comparisonResults, setComparisonResults] =
    useState<CompetitorAnalysis | null>(null);

  // Add state to track loading apps and specific loading states
  const [loadingAppIds, setLoadingAppIds] = useState<string[]>([]);
  const [loadingAppInfo, setLoadingAppInfo] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showComparisonSkeleton, setShowComparisonSkeleton] = useState(false);

  // Track processed data items to prevent duplicate processing
  const processedDataRef = useRef(new Set<string>());

  // Get app IDs from URL params
  const appIds = Array.isArray(params.appIds)
    ? params.appIds
    : params.appIds
      ? [params.appIds]
      : [];

  // Use the useChat hook from Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "/api/chat",
      initialInput: appIds.join(", "),
      id: appIds.join("-"),
    });

  // Process stream data when it arrives - using useCallback to memoize the handler
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
            }
          }
          break;
        }
        case "app_info": {
          // Add to app infos if not already present
          setAppInfos((prev) => {
            const appInfo = dataItem as AppInfo & { type: string };

            // App info is loaded, but we're still analyzing
            setLoadingAppInfo(false);

            // Check if this app info already exists
            if (prev.some((info) => info.appId === appInfo.appId)) {
              return prev;
            }
            return [...prev, appInfo];
          });
          break;
        }
        case "analysis_results": {
          // Add or update analysis results
          setAnalysisResults((prev) => {
            const result = dataItem as AppAnalysis & { type: string };

            // Analysis is complete for this app
            setLoadingAnalysis(false);

            // Remove this app from loading state completely
            setLoadingAppIds((ids) =>
              ids.filter((id) => id !== result.appName),
            );

            const index = prev.findIndex((r) => r.appName === result.appName);

            if (index >= 0) {
              const updated = [...prev];
              updated[index] = result;
              return updated;
            }

            return [...prev, result];
          });
          break;
        }
        case "comparison_results": {
          // Set comparison results
          const comparisonItem = dataItem as CompetitorAnalysis & {
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

      // Automatically submit the form with the app IDs
      // Use a type assertion to unknown first to avoid type errors
      handleSubmit(
        new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
      );
    }
  }, [appIds, handleSubmit]);

  // Add padding to the bottom of the content to account for the fixed input
  const contentPaddingBottom = "pb-24"; // Adjust based on the height of your input

  // Handle form submission for additional searches
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Extract app IDs from input
    const newAppIds = input.split(/,\s*/).filter(Boolean);

    // Navigate to the new URL with the updated app IDs
    router.push(`/compare/${newAppIds.join("/")}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">{siteConfig.name}</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-primary">
              Log in
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`flex flex-grow flex-col items-center px-4 py-8 sm:px-6 lg:px-8 ${contentPaddingBottom}`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col">
          {/* Status indicator */}
          <StatusIndicator currentStatus={currentStatus} />

          {/* App Info Cards */}
          {(appInfos.length > 0 || loadingAppInfo) && (
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Actual app info cards */}
                {appInfos.map((appInfo) => (
                  <AppInfoCard key={appInfo.appId} appInfo={appInfo} />
                ))}

                {/* Skeleton app info cards for loading apps */}
                {loadingAppInfo &&
                  loadingAppIds
                    .filter((id) => !appInfos.some((info) => info.appId === id))
                    .map((appId) => (
                      <SkeletonAppInfoCard key={`skeleton-${appId}`} />
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
                  {analysisResults.map((result) => (
                    <AnalysisCard key={result.appName} result={result} />
                  ))}

                  {/* Skeleton analysis cards for loading apps */}
                  {loadingAnalysis &&
                    loadingAppIds
                      .filter(
                        (id) =>
                          !analysisResults.some(
                            (result) => result.appName === id,
                          ),
                      )
                      .map((appId) => (
                        <SkeletonAnalysisCard
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
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 dark:text-gray-400">
          {siteConfig.name} - Compare multiple apps and get insights from Google
          Play reviews
        </div>
      </footer>

      {/* Floating input for additional searches */}
      <FloatingInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
