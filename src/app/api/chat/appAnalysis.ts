import type {
  AppAnalysisResult,
  DataStream,
  AnalysisResultsData,
} from "@/types";
import { safeSerialize, sendStatus } from "./utils";
import { fetchAppData } from "@/server/review-analyzer/services/dataFetcher";
import {
  analyzeAppReviews,
  type AnalysisUpdate,
  type AnalyzeAppReviewsResult,
} from "@/server/review-analyzer/services/reviewAnalyzer";
import {
  getAppFromDb,
  storeAppData,
  storeAnalysisResults,
  getAnalysisResultsFromDb,
} from "@/server/review-analyzer/services/dbService";

// Process a single app analysis
export async function processAppAnalysis(
  analysisAppId: number,
  appStoreId: string,
  dataStream: DataStream,
  userId: string,
  options?: { traceId?: string; userEmail?: string },
): Promise<AppAnalysisResult | null> {
  try {
    // Update status for this specific app
    sendStatus(
      dataStream,
      "analyzing",
      `Fetching data for app ${appStoreId}...`,
    );

    // Check if we have the app data in the database
    let result = await getAppFromDb(appStoreId);

    if (!result) {
      // If not in DB or data is stale, fetch from Google Play
      const { appInfo, reviews } = await fetchAppData(appStoreId);
      // Store the app data in the database
      await storeAppData(analysisAppId, appInfo, reviews);
      result = await getAppFromDb(appStoreId);
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
    const existingAnalysis = await getAnalysisResultsFromDb(appInfo.id);

    if (existingAnalysis) {
      // If we have existing analysis, use it
      sendStatus(
        dataStream,
        "processing",
        `Retrieved existing analysis for ${appInfo.name}...`,
      );

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
    const analysisGenerator = analyzeAppReviews(appInfo, reviews, {
      sampleSize: 50,
      analysisDepth: "detailed",
      traceId: options?.traceId,
      userEmail: options?.userEmail,
    });

    // Process each update from the generator
    let analysis: AnalyzeAppReviewsResult | null = null;

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
        analysis = update as AnalyzeAppReviewsResult;
      }
    }

    if (!analysis) {
      throw new Error("Analysis failed to complete");
    }

    // Send analysis results as structured data
    const analysisResults: AnalysisResultsData = {
      type: "analysis_results",
      appId: appInfo.id,
      appName: appInfo.name,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      opportunities: analysis.overview.opportunities,
      threats: analysis.overview.threats,
      marketPosition: analysis.overview.marketPosition,
      targetDemographic: analysis.overview.targetDemographic,
      keyFeatures: analysis.keyFeatures,
      pricing: {
        valueForMoney: analysis.pricingPerception.valueForMoney.toFixed(2),
        pricingComplaints: Number(
          analysis.pricingPerception.pricingComplaints.toFixed(1),
        ),
        willingness: analysis.pricingPerception.willingness,
        reviewIds: analysis.pricingPerception.reviewIds || [],
      },
      recommendations: analysis.recommendedActions.map(
        (r: {
          action: string;
          priority: string;
          impact: string;
          timeframe?: string;
          targetSegment?: string;
        }) => ({
          action: r.action,
          priority: r.priority,
          impact: r.impact,
        }),
      ),
    };

    // Extract review ID mappings if they exist
    const rawData = analysis;

    // Create review ID mappings if they exist
    if (
      rawData.strengths ||
      rawData.weaknesses ||
      rawData.sentiment?.reviewMap ||
      rawData.keyFeatures
    ) {
      const strengthsReviewMap: Record<string, string[] | number[]> = {};
      const weaknessesReviewMap: Record<string, string[] | number[]> = {};
      let sentimentReviewMap: Record<string, string[] | number[]> = {};
      const featuresReviewMap: Record<string, string[] | number[]> = {};

      // Process strengths
      if (rawData.strengths) {
        rawData.strengths.forEach((strength) => {
          if (strength.title && strength.reviewIds) {
            strengthsReviewMap[strength.title] = strength.reviewIds;
          }
        });
      }

      // Process weaknesses
      if (rawData.weaknesses) {
        rawData.weaknesses.forEach((weakness) => {
          if (weakness.title && weakness.reviewIds) {
            weaknessesReviewMap[weakness.title] = weakness.reviewIds;
          }
        });
      }

      // Process sentiment review map
      if (rawData.sentiment?.reviewMap) {
        sentimentReviewMap = rawData.sentiment.reviewMap;
      }

      // Process features
      if (rawData.keyFeatures) {
        rawData.keyFeatures.forEach((feature) => {
          if (feature.feature && feature.reviewIds) {
            featuresReviewMap[feature.feature] = feature.reviewIds;
          }
        });
      }

      // Add review mappings to results
      analysisResults.reviewMappings = {
        strengthsReviewMap,
        weaknessesReviewMap,
        sentimentReviewMap,
        featuresReviewMap,
      };
    }

    // Send analysis to client as a serializable object
    dataStream.writeData(safeSerialize(analysisResults));

    // Store the analysis results in the database
    await storeAnalysisResults(appInfo, analysis, analysisResults);

    // Return the analysis data
    return {
      appInfo,
      analysis,
      analysisResults,
    };
  } catch (error) {
    console.error(`Error processing app analysis for ${appStoreId}:`, error);
    sendStatus(
      dataStream,
      "error",
      `Error analyzing app: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}
