import type {
  AppAnalysisResult,
  DataStream,
  AnalysisResultsData,
} from "./types";
import { safeSerialize, sendStatus } from "./utils";
import { fetchAppData } from "@/server/review-analyzer/services/dataFetcher";
import {
  analyzeAppReviews,
  type AnalysisUpdate,
} from "@/server/review-analyzer/services/reviewAnalyzer";
import {
  getAppFromDb,
  storeAppData,
  storeAnalysisResults,
  getAnalysisResultsFromDb,
} from "@/server/review-analyzer/services/dbService";
import type { AppAnalysis } from "@/server/review-analyzer/types";

// Process a single app analysis
export async function processAppAnalysis(
  appId: string,
  dataStream: DataStream,
  userId: string,
): Promise<AppAnalysisResult | null> {
  try {
    // Update status for this specific app
    sendStatus(dataStream, "analyzing", `Fetching data for app ${appId}...`);

    // Check if we have the app data in the database
    let result = await getAppFromDb(appId);

    if (!result) {
      // If not in DB or data is stale, fetch from Google Play
      const { appInfo, reviews } = await fetchAppData(appId);
      // Store the app data in the database
      await storeAppData(appInfo, reviews);
      result = await getAppFromDb(appId);
    }

    if (!result) {
      throw new Error("App not found. Something went wrong");
    }

    const { appInfo, reviews } = result;
    // Format the app info to display to user
    const appInfoSummary = {
      type: "app_info",
      ...appInfo, // Include all fields from appInfo which follows the App model
    };

    // Send app info to the client
    dataStream.writeData(safeSerialize(appInfoSummary));

    // Check if we have existing analysis results in the database
    const existingAnalysis = await getAnalysisResultsFromDb(appId);

    if (existingAnalysis) {
      // If we have existing analysis, use it
      sendStatus(
        dataStream,
        "processing",
        `Retrieved existing analysis for ${appInfo.name}...`,
      );

      // Fill in the app name in the analysis results
      existingAnalysis.analysisResults.appName = appInfo.name;

      // Send the existing analysis results to the client
      dataStream.writeData(safeSerialize(existingAnalysis.analysisResults));

      // Return the existing analysis data
      return {
        appInfo,
        analysis: existingAnalysis.analysis,
        analysisResults: existingAnalysis.analysisResults,
      };
    }

    // If no existing analysis, generate a new one
    sendStatus(
      dataStream,
      "processing",
      `Generating new analysis for ${appInfo.name}...`,
    );

    // Use the new generator function for analysis
    const analysisGenerator = analyzeAppReviews(appInfo, reviews);

    // Process each update from the generator
    let analysis: AppAnalysis | null = null;

    for await (const update of analysisGenerator) {
      // Check if the update is a status/error update or the final analysis result
      if ((update as AnalysisUpdate).type !== undefined) {
        // It's a status update
        const statusUpdate = update as AnalysisUpdate;
        // Forward status updates to client
        dataStream.writeData(
          safeSerialize({
            type: statusUpdate.type,
            status: statusUpdate.status,
            message: statusUpdate.message,
            progress: statusUpdate.progress,
            ...(statusUpdate.data ?? {}),
          }),
        );
      } else {
        // It's the final analysis
        analysis = update as AppAnalysis;
      }
    }

    if (!analysis) {
      throw new Error("Analysis failed to complete");
    }

    // Send analysis results as structured data
    const analysisResults: AnalysisResultsData = {
      type: "analysis_results",
      appId: appInfo.appId,
      appName: appInfo.name,
      ...analysis.overview,
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

    // Store the analysis results in the database
    if (userId) {
      await storeAnalysisResults(userId, appInfo, analysis, analysisResults);
    }

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
      `Failed to analyze app ${appId}: ${(error as Error).message}`,
    );
    return null;
  }
}
