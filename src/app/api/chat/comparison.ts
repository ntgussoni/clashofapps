import type {
  AppAnalysisResult,
  FeatureComparisonItem,
  StrengthsResult,
  WeaknessesResult,
  ComparisonData,
} from "./types";
import { generateAIRecommendations } from "./recommendations";
import { db } from "@/server/db";

// Check if user has access to all apps in a comparison
async function checkUserComparisonAccess(
  userId: string,
  appIds: string[],
): Promise<boolean> {
  try {
    // Get user's analyses that contain any of these app IDs
    const userAnalyses = await db.analysis.findMany({
      where: {
        userId: userId,
        analysisApps: {
          some: {
            appId: {
              in: appIds,
            },
          },
        },
      },
      include: {
        analysisApps: {
          where: {
            appId: {
              in: appIds,
            },
          },
          select: {
            appId: true,
          },
        },
      },
    });

    // Extract all accessible app IDs
    const accessibleAppIds = new Set<string>();
    userAnalyses.forEach((analysis) => {
      analysis.analysisApps.forEach((app) => {
        accessibleAppIds.add(app.appId);
      });
    });

    // Check if all requested app IDs are accessible to the user
    return appIds.every((appId) => accessibleAppIds.has(appId));
  } catch (error) {
    console.error("Error checking user comparison access:", error);
    return false;
  }
}

// Function to process map entries for strengths
export function processStrengthsMap(
  map: Map<string, string[]>,
): StrengthsResult {
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
export function processWeaknessesMap(
  map: Map<string, string[]>,
): WeaknessesResult {
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
export async function generateComparison(
  appAnalyses: AppAnalysisResult[],
  userId: string,
): Promise<ComparisonData> {
  // Extract app IDs for authorization check
  const appIds = appAnalyses.map((analysis) => analysis.appInfo.appId);

  // Check if user has access to all apps
  const hasAccess = await checkUserComparisonAccess(userId, appIds);

  if (!hasAccess) {
    throw new Error(
      "Access denied: You don't have permission to compare one or more of these apps",
    );
  }

  // Prepare comparison data
  const comparisonData: ComparisonData = {
    type: "comparison_results",
    apps: appAnalyses.map((analysis) => ({
      appName: analysis.appInfo.name,
      appId: analysis.appInfo.appId,
      rating: analysis.appInfo.score.toFixed(1),
      ratingCount: analysis.appInfo.reviews,
    })),
    featureComparison: compareFeatures(appAnalyses),
    strengthsComparison: compareStrengths(appAnalyses),
    weaknessesComparison: compareWeaknesses(appAnalyses),
    marketPositionComparison: compareMarketPosition(appAnalyses),
    pricingComparison: comparePricing(appAnalyses),
    userBaseComparison: compareUserBase(appAnalyses),
    recommendationSummary: await generateAIRecommendations(appAnalyses),
  };

  return comparisonData;
}

// Helper functions for comparison
export function compareFeatures(
  appAnalyses: AppAnalysisResult[],
): FeatureComparisonItem[] {
  // Get top features from each app and compare sentiment
  const allFeatures = new Map<
    string,
    {
      scores: number[];
      mentions: number[];
      apps: string[];
    }
  >();

  appAnalyses.forEach((analysis) => {
    const appName = analysis.appInfo.name;
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

export function compareStrengths(
  appAnalyses: AppAnalysisResult[],
): StrengthsResult {
  // Compare strengths across apps
  const appStrengths = appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
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

export function compareWeaknesses(
  appAnalyses: AppAnalysisResult[],
): WeaknessesResult {
  // Compare weaknesses across apps
  const appWeaknesses = appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
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

export function compareMarketPosition(appAnalyses: AppAnalysisResult[]) {
  // Return market position for each app
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
    marketPosition: analysis.analysis.overview.marketPosition,
  }));
}

export function comparePricing(appAnalyses: AppAnalysisResult[]) {
  // Compare pricing perception across apps
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
    valueForMoney: analysis.analysis.pricingPerception.valueForMoney,
    pricingComplaints: analysis.analysis.pricingPerception.pricingComplaints,
    willingness: analysis.analysis.pricingPerception.willingness,
  }));
}

export function compareUserBase(appAnalyses: AppAnalysisResult[]) {
  // Compare user demographics across apps
  return appAnalyses.map((analysis) => ({
    appName: analysis.appInfo.name,
    demographics: analysis.analysis.overview.targetDemographic,
  }));
}
