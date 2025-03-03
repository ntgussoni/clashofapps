import { fetchAppData } from "../../../server/review-analyzer/services/dataFetcher";
import { analyzeReviews } from "../../../server/review-analyzer/services/reviewAnalyzer";
import { createDataStreamResponse, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";
import type {
  AppInfo,
  AppAnalysis,
} from "../../../server/review-analyzer/types";
import type { JSONValue } from "ai";

// Define a type for our data stream
interface DataStream {
  writeData: (data: JSONValue) => void;
}

// Define interfaces for our data structures
interface AppAnalysisResult {
  appInfo: AppInfo;
  analysis: AppAnalysis;
  analysisResults: AnalysisResultsData;
}

interface AnalysisResultsData {
  type: string;
  appId: string;
  appName: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  userDemographics: string;
  topFeatures: {
    feature: string;
    sentiment: string;
    mentions: number;
  }[];
  pricing: {
    valueForMoney: string;
    pricingComplaints: string;
    willingness: string;
  };
  recommendations: {
    action: string;
    priority: string;
    impact: string;
  }[];
}

interface FeatureData {
  scores: number[];
  mentions: number[];
  apps: string[];
}

interface FeatureComparisonItem {
  feature: string;
  appCoverage: number;
  averageSentiment: number;
  totalMentions: number;
  presentInApps: string[];
}

interface ComparisonData {
  type: string;
  apps: {
    appName: string;
    appId: string;
    rating: string;
    ratingCount: number;
  }[];
  featureComparison: FeatureComparisonItem[];
  strengthsComparison: {
    common: { strength: string; apps: string[] }[];
    unique: { strength: string; app: string }[];
  };
  weaknessesComparison: {
    common: { weakness: string; apps: string[] }[];
    unique: { weakness: string; app: string }[];
  };
  marketPositionComparison: { appName: string; marketPosition: string }[];
  pricingComparison: {
    appName: string;
    valueForMoney: number;
    pricingComplaints: number;
    willingness: string;
  }[];
  userBaseComparison: { appName: string; demographics: string }[];
  recommendationSummary: string[];
}

// Helper function to safely serialize data for the data stream
function safeSerialize<T>(data: T): JSONValue {
  return JSON.parse(JSON.stringify(data)) as JSONValue;
}

// Helper function to send status updates
function sendStatus(
  dataStream: DataStream,
  status: string,
  message: string,
): void {
  dataStream.writeData({
    type: "status",
    status,
    message,
  });
}

// Extract app IDs from input string
function extractAppIds(input: string): string[] {
  // Split by commas or spaces if the input contains them
  if (
    input.includes(",") ||
    input.includes(" vs ") ||
    input.includes(" versus ")
  ) {
    const appIds: string[] = [];
    // Split by various delimiters
    const parts = input.split(/,|\s+vs\s+|\s+versus\s+/).map((p) => p.trim());

    for (const part of parts) {
      if (part) {
        appIds.push(extractAppId(part));
      }
    }

    return appIds;
  }

  // If there's only one app ID
  return [extractAppId(input)];
}

// Extract a single app ID from URL or string
function extractAppId(input: string): string {
  // If it's already an app ID (no slashes or https), return it
  if (!input.includes("/") && !input.includes("https")) {
    return input;
  }

  // If it's a URL, extract the app ID
  try {
    const url = new URL(input);
    const pathParts = url.pathname.split("/");

    // Handle the case where the URL is from the Play Store
    if (url.hostname === "play.google.com") {
      // Format: https://play.google.com/store/apps/details?id=com.example.app
      const params = new URLSearchParams(url.search);
      const appId = params.get("id");
      if (appId) return appId;
    }

    // Try to find the app ID in the path (id might be after /id/ in the path)
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === "id" && i + 1 < pathParts.length) {
        const pathId = pathParts[i + 1];
        if (pathId) return pathId;
      }
    }
  } catch (e) {
    // If URL parsing fails, just return the input as-is
    console.error("Error parsing URL:", e);
  }

  return input; // Return the input as fallback
}

// Type for the result of processMapEntries for strengths
interface StrengthsResult {
  common: { strength: string; apps: string[] }[];
  unique: { strength: string; app: string }[];
}

// Type for the result of processMapEntries for weaknesses
interface WeaknessesResult {
  common: { weakness: string; apps: string[] }[];
  unique: { weakness: string; app: string }[];
}

// Function to process map entries for strengths
function processStrengthsMap(map: Map<string, string[]>): StrengthsResult {
  const common = Array.from(map.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([strength, apps]) => ({
      strength,
      apps,
    }));

  const unique = Array.from(map.entries())
    .filter(([, apps]) => apps.length === 1)
    .map(([strength, apps]) => ({
      strength,
      app: apps[0] ?? "",
    }));

  return { common, unique };
}

// Function to process map entries for weaknesses
function processWeaknessesMap(map: Map<string, string[]>): WeaknessesResult {
  const common = Array.from(map.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([weakness, apps]) => ({
      weakness,
      apps,
    }));

  const unique = Array.from(map.entries())
    .filter(([, apps]) => apps.length === 1)
    .map(([weakness, apps]) => ({
      weakness,
      app: apps[0] ?? "",
    }));

  return { common, unique };
}

// Function to generate cross-app comparison
async function generateComparison(
  appAnalyses: AppAnalysisResult[],
): Promise<ComparisonData> {
  // Prepare comparison data
  const comparisonData: ComparisonData = {
    type: "comparison_results",
    apps: appAnalyses.map((analysis) => ({
      appName: analysis.appInfo.appName,
      appId: analysis.appInfo.appId,
      rating: analysis.appInfo.appScore.toFixed(1),
      ratingCount: analysis.appInfo.reviews.length,
    })),
    featureComparison: compareFeatures(appAnalyses),
    strengthsComparison: compareStrengths(appAnalyses),
    weaknessesComparison: compareWeaknesses(appAnalyses),
    marketPositionComparison: compareMarketPosition(appAnalyses),
    pricingComparison: comparePricing(appAnalyses),
    userBaseComparison: compareUserBase(appAnalyses),
    recommendationSummary: generateRecommendationSummary(appAnalyses),
  };

  return comparisonData;
}

// Helper functions for comparison
function compareFeatures(
  appAnalyses: AppAnalysisResult[],
): FeatureComparisonItem[] {
  // Get top features from each app and compare sentiment
  const allFeatures = new Map<string, FeatureData>();

  appAnalyses.forEach((analysis) => {
    const appName = analysis.appInfo.appName;
    analysis.analysis.featureAnalysis.forEach((feature) => {
      const featureName = feature.feature.toLowerCase();
      if (!allFeatures.has(featureName)) {
        allFeatures.set(featureName, { scores: [], mentions: [], apps: [] });
      }
      const featureData = allFeatures.get(featureName)!;
      featureData.scores.push(feature.sentimentScore);
      featureData.mentions.push(feature.mentionCount);
      featureData.apps.push(appName);
    });
  });

  // Convert to array and sort by number of apps and then by total mentions
  return Array.from(allFeatures.entries())
    .map(([feature, data]) => ({
      feature: feature,
      appCoverage: data.apps.length / appAnalyses.length,
      averageSentiment:
        data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
      totalMentions: data.mentions.reduce((sum, count) => sum + count, 0),
      presentInApps: data.apps,
    }))
    .sort(
      (a, b) =>
        b.appCoverage - a.appCoverage || b.totalMentions - a.totalMentions,
    );
}

function compareStrengths(appAnalyses: AppAnalysisResult[]): StrengthsResult {
  // Compare strengths across apps
  const appStrengths = appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.appName,
    strengths: analysis.analysis.overview.strengths,
  }));

  // Find common strengths
  const strengthsMap = new Map<string, string[]>();

  appStrengths.forEach((appStrength) => {
    appStrength.strengths.forEach((strength: string) => {
      const key = strength.toLowerCase();
      if (!strengthsMap.has(key)) {
        strengthsMap.set(key, []);
      }
      strengthsMap.get(key)!.push(appStrength.appName);
    });
  });

  // Return common strengths and unique strengths using the helper function
  return processStrengthsMap(strengthsMap);
}

function compareWeaknesses(appAnalyses: AppAnalysisResult[]): WeaknessesResult {
  // Compare weaknesses across apps
  const appWeaknesses = appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.appName,
    weaknesses: analysis.analysis.overview.weaknesses,
  }));

  // Find common weaknesses
  const weaknessesMap = new Map<string, string[]>();

  appWeaknesses.forEach((appWeakness) => {
    appWeakness.weaknesses.forEach((weakness: string) => {
      const key = weakness.toLowerCase();
      if (!weaknessesMap.has(key)) {
        weaknessesMap.set(key, []);
      }
      weaknessesMap.get(key)!.push(appWeakness.appName);
    });
  });

  // Return common weaknesses and unique weaknesses using the helper function
  return processWeaknessesMap(weaknessesMap);
}

function compareMarketPosition(appAnalyses: AppAnalysisResult[]) {
  // Return market position for each app
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.appName,
    marketPosition: analysis.analysis.overview.marketPosition,
  }));
}

function comparePricing(appAnalyses: AppAnalysisResult[]) {
  // Compare pricing perception across apps
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.appName,
    valueForMoney: analysis.analysis.pricingPerception.valueForMoney,
    pricingComplaints: analysis.analysis.pricingPerception.pricingComplaints,
    willingness: analysis.analysis.pricingPerception.willingness,
  }));
}

function compareUserBase(appAnalyses: AppAnalysisResult[]) {
  // Compare user demographics across apps
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.appName,
    demographics: analysis.analysis.overview.targetDemographic,
  }));
}

function generateRecommendationSummary(
  appAnalyses: AppAnalysisResult[],
): string[] {
  // Generate recommendations based on the comparison
  const recommendations: string[] = [];

  if (appAnalyses.length === 0) {
    return recommendations;
  }

  // Find the app with the highest rating
  const highestRatedApp = [...appAnalyses].sort(
    (a, b) => b.appInfo.appScore - a.appInfo.appScore,
  )[0];

  if (
    highestRatedApp &&
    highestRatedApp.analysis.overview.strengths.length > 0
  ) {
    const strengths = highestRatedApp.analysis.overview.strengths;
    if (strengths.length > 0) {
      recommendations.push(
        `Focus on the strengths of ${
          highestRatedApp.appInfo.appName
        } such as ${strengths.join(" and ")}.`,
      );
    }
  }

  // Find common weaknesses to address
  const commonWeaknesses = compareWeaknesses(appAnalyses).common;
  if (commonWeaknesses.length > 0) {
    recommendations.push(
      `Address common weaknesses across all apps: ${commonWeaknesses
        .map((w) => w.weakness)
        .join(" and ")}.`,
    );
  }

  // Find feature opportunities
  const featureComparison = compareFeatures(appAnalyses);
  const highSentimentFeatures = featureComparison.filter(
    (f) => f.averageSentiment > 0.5,
  );
  if (highSentimentFeatures.length > 0) {
    const feature = highSentimentFeatures[0];
    if (feature) {
      recommendations.push(
        `Capitalize on highly rated features like "${feature.feature}" across all apps.`,
      );
    }
  }

  return recommendations;
}

// Extract all app IDs from previous messages
function extractAllAppIdsFromMessages(
  messages: { role: string; content: string }[],
): Set<string> {
  const allAppIds = new Set<string>();

  messages.forEach((message) => {
    if (message.role === "user" && message.content) {
      const appIds = extractAppIds(message.content);
      appIds.forEach((id) => allAppIds.add(id));
    }
  });

  return allAppIds;
}

// Generate analysis text for a single app
function generateSingleAppAnalysisText(appAnalysis: AppAnalysisResult): string {
  const { appInfo, analysis } = appAnalysis;

  return (
    `## Analysis Results for ${appInfo.appName}\n\n` +
    `### Strengths\n${analysis.overview.strengths
      .map((s: string) => `- ${s}`)
      .join("\n")}\n\n` +
    `### Weaknesses\n${analysis.overview.weaknesses
      .map((w: string) => `- ${w}`)
      .join("\n")}\n\n` +
    `### Market Position\n${analysis.overview.marketPosition}\n\n` +
    `### User Demographics\n${analysis.overview.targetDemographic}\n\n` +
    `### Top Features\n${analysis.featureAnalysis
      .map(
        (f) =>
          `- **${f.feature}**: Sentiment ${f.sentimentScore.toFixed(
            2,
          )}, Mentions: ${f.mentionCount}`,
      )
      .join("\n")}\n\n` +
    `### Pricing Perception\n` +
    `Value for Money: ${analysis.pricingPerception.valueForMoney.toFixed(
      2,
    )} (from -1 to 1)\n` +
    `Pricing Complaints: ${analysis.pricingPerception.pricingComplaints.toFixed(
      1,
    )}%\n` +
    `Willingness to Pay: ${analysis.pricingPerception.willingness}\n\n` +
    `### Top Recommendations\n${analysis.recommendedActions
      .map(
        (r) =>
          `- **${r.action}** (Priority: ${r.priority}, Impact: ${r.impact})`,
      )
      .join("\n")}`
  );
}

// Generate analysis text for app comparison
function generateComparisonAnalysisText(
  appAnalyses: AppAnalysisResult[],
  comparisonData: ComparisonData,
): string {
  const appNames = appAnalyses.map((a) => a.appInfo.appName).join(" vs ");

  return (
    `## Comparison Analysis: ${appNames}\n\n` +
    `### Key Metrics Comparison\n` +
    appAnalyses
      .map(
        (a) =>
          `**${a.appInfo.appName}**: ${a.appInfo.appScore.toFixed(
            1,
          )}/5 stars, ${a.appInfo.reviews.length} reviews`,
      )
      .join("\n") +
    `\n\n### Common Strengths\n` +
    (comparisonData.strengthsComparison.common.length > 0
      ? comparisonData.strengthsComparison.common
          .map((s) => `- ${s.strength} (Found in: ${s.apps.join(", ")})`)
          .join("\n")
      : "No common strengths found.") +
    `\n\n### Common Weaknesses\n` +
    (comparisonData.weaknessesComparison.common.length > 0
      ? comparisonData.weaknessesComparison.common
          .map((w) => `- ${w.weakness} (Found in: ${w.apps.join(", ")})`)
          .join("\n")
      : "No common weaknesses found.") +
    `\n\n### Feature Comparison\n` +
    (comparisonData.featureComparison.length > 0
      ? comparisonData.featureComparison

          .map(
            (f) =>
              `- **${f.feature}**: Mentioned in ${(f.appCoverage * 100).toFixed(
                0,
              )}% of apps, Avg. sentiment: ${f.averageSentiment.toFixed(2)}`,
          )
          .join("\n")
      : "No feature comparison available.") +
    `\n\n### Pricing Comparison\n` +
    comparisonData.pricingComparison
      .map(
        (p) =>
          `- **${p.appName}**: Value for money: ${p.valueForMoney.toFixed(
            2,
          )}, Pricing complaints: ${p.pricingComplaints.toFixed(1)}%`,
      )
      .join("\n") +
    `\n\n### Recommendation Summary\n` +
    (comparisonData.recommendationSummary.length > 0
      ? comparisonData.recommendationSummary.map((r) => `- ${r}`).join("\n")
      : "No recommendations available.")
  );
}

// Process a single app analysis
async function processAppAnalysis(
  appId: string,
  dataStream: DataStream,
): Promise<AppAnalysisResult | null> {
  try {
    // Update status for this specific app
    sendStatus(dataStream, "analyzing", `Fetching data for app ${appId}...`);

    // Fetch app data from Google Play
    const appInfo = await fetchAppData(appId);

    // Format the app info to display to user
    const appInfoSummary = {
      type: "app_info",
      appName: appInfo.appName,
      appId: appInfo.appId,
      icon: appInfo.appIcon,
      categories: appInfo.categories,
      rating: appInfo.appScore.toFixed(1),
      reviewCount: appInfo.reviews.length,
      installs: appInfo.installs,
      version: appInfo.version,
    };

    // Send app info to the client
    dataStream.writeData(safeSerialize(appInfoSummary));

    // Update status - be explicit about analyzing reviews
    sendStatus(
      dataStream,
      "analyzing",
      `Analyzing ${appInfo.reviews.length} reviews for ${appInfo.appName}...`,
    );

    // Analyze reviews
    const analysis = await analyzeReviews(appInfo);

    // Send analysis results as structured data
    const analysisResults: AnalysisResultsData = {
      type: "analysis_results",
      appId: appInfo.appId,
      appName: appInfo.appName,
      strengths: analysis.overview.strengths,
      weaknesses: analysis.overview.weaknesses,
      marketPosition: analysis.overview.marketPosition,
      userDemographics: analysis.overview.targetDemographic,
      topFeatures: analysis.featureAnalysis.map((f) => ({
        feature: f.feature,
        sentiment: f.sentimentScore.toFixed(2),
        mentions: f.mentionCount,
      })),
      pricing: {
        valueForMoney: analysis.pricingPerception.valueForMoney.toFixed(2),
        pricingComplaints:
          analysis.pricingPerception.pricingComplaints.toFixed(1),
        willingness: analysis.pricingPerception.willingness,
      },
      recommendations: analysis.recommendedActions.map((r) => ({
        action: r.action,
        priority: r.priority,
        impact: r.impact,
      })),
    };

    // Send analysis to client as a serializable object
    dataStream.writeData(safeSerialize(analysisResults));

    // Return the analysis data
    return {
      appInfo,
      analysis,
      analysisResults,
    };
  } catch (error) {
    console.error(`Error analyzing app ${appId}:`, error);
    sendStatus(
      dataStream,
      "error",
      `Error analyzing app ${appId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null; // Return null for failed analyses
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: string; content: string }[];
    };

    // Get the user's latest message
    const userMessage = messages[messages.length - 1];

    if (!userMessage || userMessage.role !== "user") {
      throw new Error("Missing or invalid user message");
    }

    // Extract app IDs from the user's request
    const input = userMessage.content;
    const newAppIds = extractAppIds(input);

    // Get all app IDs from previous messages to ensure we include previously analyzed apps
    const allAppIdsSet = extractAllAppIdsFromMessages(messages);

    // Add new app IDs to the set
    newAppIds.forEach((id) => allAppIdsSet.add(id));

    // Convert set to array
    const allAppIds = Array.from(allAppIdsSet);

    // Create a data stream response
    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          // Update status messages to be more specific
          sendStatus(
            dataStream,
            "analyzing",
            `Analyzing ${newAppIds.length} new app${
              newAppIds.length > 1 ? "s" : ""
            }: ${newAppIds.join(", ")}`,
          );

          // Store app info and analysis results for all apps
          const appAnalyses: AppAnalysisResult[] = [];

          // Process all apps in parallel
          const analysisPromises = newAppIds.map((appId) =>
            processAppAnalysis(appId, dataStream),
          );

          // Wait for all analyses to complete
          const results = await Promise.all(analysisPromises);

          // Filter out null results (failed analyses)
          const validResults = results.filter(
            (result): result is AppAnalysisResult => result !== null,
          );
          appAnalyses.push(...validResults);

          // Generate and send cross-app comparison if we have multiple apps in total
          // This ensures comparison is generated even when adding just one new app
          if (allAppIds.length > 1 && appAnalyses.length > 1) {
            sendStatus(
              dataStream,
              "analyzing",
              `Generating cross-app comparison for ${appAnalyses.length} apps...`,
            );

            const comparisonData = await generateComparison(appAnalyses);
            dataStream.writeData(safeSerialize(comparisonData));
          }

          // Format analysis for AI summary
          let analysisText = "";

          if (
            newAppIds.length === 1 &&
            appAnalyses.length === 1 &&
            appAnalyses[0]
          ) {
            // Single app summary format
            analysisText = generateSingleAppAnalysisText(appAnalyses[0]);
          } else if (appAnalyses.length > 0) {
            // Comparison summary format
            const comparisonData = await generateComparison(appAnalyses);
            analysisText = generateComparisonAnalysisText(
              appAnalyses,
              comparisonData,
            );
          }

          // Update status before AI summary
          if (appAnalyses.length > 0) {
            sendStatus(
              dataStream,
              "summarizing",
              `Generating AI summary of analysis results...`,
            );

            // Stream a summarized response using the AI model
            const systemPrompt =
              newAppIds.length === 1
                ? "You are an expert app analyst whose job is to help the user analyze and find gaps on their competitors. Summarize the following app analysis in a professional to the point but friendly tone. Highlight the most important insights and action items."
                : "You are an expert app analyst whose job is to help the user analyze and find gaps on their competitors. Summarize the following app comparison in a professional to the point but friendly tone. Focus on the key differences between the apps and highlight actionable insights based on the comparison.";

            const result = streamText({
              model: openai("gpt-4o-mini"),
              messages: [
                {
                  role: "system",
                  content:
                    systemPrompt +
                    " Use markdown formatting for better readability. Keep your response concise but informative.",
                },
                {
                  role: "user",
                  content: analysisText,
                },
              ],
              onFinish: () => {
                // When AI is done, send completed status
                const appName =
                  appAnalyses.length > 0 && appAnalyses[0]
                    ? appAnalyses[0].appInfo.appName
                    : "apps";

                sendStatus(
                  dataStream,
                  "completed",
                  `Analysis completed for ${
                    newAppIds.length > 1 ? `${newAppIds.length} apps` : appName
                  }`,
                );
              },
            });

            // Merge the AI stream into our data stream
            result.mergeIntoDataStream(dataStream);
          } else {
            // If all analyses failed, send completed status
            sendStatus(
              dataStream,
              "completed",
              "Analysis completed, but no valid results were found.",
            );
          }
        } catch (error) {
          console.error("Error in app analysis:", error);

          // Send error status to client
          sendStatus(
            dataStream,
            "error",
            `Error analyzing app: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      },
      onError: (error) => {
        // Return a proper error message for the client
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error: unknown) {
    console.error("Error in chat processing:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to process request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
