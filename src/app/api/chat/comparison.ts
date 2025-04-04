import type {
  AppAnalysisResult,
  FeatureComparisonItem,
  ComparisonData,
} from "@/types";
import { generateAIRecommendations } from "./recommendations";

// Function to generate cross-app comparison
export async function generateComparison(
  appAnalyses: AppAnalysisResult[],
  options?: { traceId?: string; userEmail?: string },
): Promise<ComparisonData> {
  // Generate comparison data from multiple app analyses
  const { featureComparison, featureReviewMap } = compareFeatures(appAnalyses);

  // Get market position and pricing comparisons
  const marketPositionComparison = compareMarketPosition(appAnalyses);
  const { pricingComparison, pricingReviewMap } = comparePricing(appAnalyses);
  const userBaseComparison = compareUserBase(appAnalyses);

  // Generate AI recommendations
  const recommendationSummary = await generateAIRecommendations(
    appAnalyses,
    options,
  );

  // Construct app data for the comparison
  const apps = appAnalyses.map((app) => ({
    appName: app.appInfo.name,
    appId: app.appInfo.id,
    rating: app.appInfo.score ? app.appInfo.score.toFixed(1) : "0.0",
    ratingCount: app.appInfo.ratings ?? 0,
  }));

  // Collect all review mappings with debug logs
  const reviews = {
    feature: featureReviewMap || {},
    pricing: pricingReviewMap || {},
  };

  // Return the comprehensive comparison data
  return {
    type: "comparison_results",
    apps,
    featureComparison,
    marketPositionComparison,
    pricingComparison,
    userBaseComparison,
    recommendationSummary,
    reviews,
  };
}

export function compareFeatures(appAnalyses: AppAnalysisResult[]): {
  featureComparison: FeatureComparisonItem[];
  featureReviewMap: Record<string, Record<string, number[]>>;
} {
  // Get top features from each app and compare sentiment
  const allFeatures = new Map<
    string,
    {
      scores: number[];
      mentions: number[];
      apps: string[];
      reviewIds: Record<string, number[]>; // Map app name to review IDs
    }
  >();

  // Process app analyses one by one
  for (const analysis of appAnalyses) {
    const appName = analysis.appInfo.name;

    // Extract and normalize features from the analysis

    // Process all normalized features
    for (const feature of analysis.analysis.keyFeatures) {
      const featureName = feature.feature.toLowerCase();

      // Add to allFeatures map
      if (!allFeatures.has(featureName)) {
        allFeatures.set(featureName, {
          scores: [],
          mentions: [],
          apps: [],
          reviewIds: {},
        });
      }

      const featureData = allFeatures.get(featureName);
      if (featureData) {
        // Convert sentiment string to a numeric value for calculations
        let sentimentValue: number;
        switch (feature.sentiment) {
          case "positive":
            sentimentValue = 1;
            break;
          case "negative":
            sentimentValue = -1;
            break;
          case "mixed":
            sentimentValue = 0.25;
            break;
          case "neutral":
          default:
            sentimentValue = 0;
            break;
        }

        featureData.scores.push(sentimentValue);
        // Use a default value for mentions since we now have description instead
        const mentions = feature.reviewIds.length || 1;
        featureData.mentions.push(mentions);

        // Store review IDs for this feature and app
        featureData.reviewIds[appName] = feature.reviewIds;

        if (!featureData.apps.includes(appName)) {
          featureData.apps.push(appName);
        }
      }
    }
  }

  // Prepare the review mappings with better logging
  const featureReviewMap: Record<string, Record<string, number[]>> = {};

  // Convert to array and sort by number of apps and then by total mentions
  const featureComparison = Array.from(allFeatures.entries())
    .map(([feature, data]) => {
      // Store the review mappings for this feature
      featureReviewMap[feature] = data.reviewIds;

      return {
        feature: feature,
        appCoverage: data.apps.length / appAnalyses.length,
        averageSentiment:
          data.scores.reduce((sum, score) => sum + score, 0) /
          (data.scores.length || 1),
        totalMentions: data.mentions.reduce((sum, count) => sum + count, 0),
        presentInApps: data.apps,
      };
    })
    .sort(
      (a, b) =>
        b.appCoverage - a.appCoverage || b.totalMentions - a.totalMentions,
    );

  return { featureComparison, featureReviewMap };
}

export function compareMarketPosition(appAnalyses: AppAnalysisResult[]) {
  // Return market position for each app
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
    marketPosition: analysis.analysis.overview?.marketPosition || "",
  }));
}

export function comparePricing(appAnalyses: AppAnalysisResult[]): {
  pricingComparison: Array<{
    appName: string;
    valueForMoney: number;
    pricingComplaints: number;
    willingness: string;
    reviewIds: number[];
  }>;
  pricingReviewMap: Record<string, number[]>;
} {
  // Initialize the review mapping object
  const pricingReviewMap: Record<string, number[]> = {};

  // Compare pricing perception across apps
  const pricingComparison = appAnalyses.map((analysis) => {
    const appName = analysis.appInfo.name;
    const pricingPerception = analysis.analysis.pricingPerception as {
      valueForMoney: number;
      pricingComplaints: number;
      willingness: string;
      reviewIds: number[];
    };

    // Ensure reviewIds exists and is an array
    const reviewIds = Array.isArray(pricingPerception?.reviewIds)
      ? pricingPerception.reviewIds
      : [];

    // Add review IDs to the map
    pricingReviewMap[appName] = reviewIds;

    return {
      appName,
      valueForMoney: pricingPerception?.valueForMoney || 0,
      pricingComplaints: pricingPerception?.pricingComplaints || 0,
      willingness: pricingPerception?.willingness || "",
      reviewIds: reviewIds,
    };
  });

  return { pricingComparison, pricingReviewMap };
}

export function compareUserBase(appAnalyses: AppAnalysisResult[]) {
  // Compare user demographics across apps
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
    demographics: analysis.analysis.overview?.targetDemographic || "",
  }));
}
