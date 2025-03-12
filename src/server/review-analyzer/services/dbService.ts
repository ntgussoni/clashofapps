import { db } from "@/server/db";
import {
  type AppAnalysis,
  type AppInfo,
  type Review,
  type AnalysisResultsData,
  type ComparisonData,
  type PricingComparisonItem,
  type FeatureComparisonItem,
} from "@/types";
import { type App, type Prisma } from "@prisma/client";

/**
 * Get app data from database or return null if not found or expired
 * @param appId
 * @param maxAgeDays
 * @returns
 */
export async function getAppFromDb(appStoreId: string, maxAgeDays = 30) {
  // Check if app exists in database and is fresh (less than specified days old)
  try {
    const existingApp = await db.app.findFirst({
      where: {
        appStoreId,
        lastFetched: {
          gte: new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        appReviews: true,
      },
    });

    if (!existingApp) {
      return null;
    }

    return {
      appInfo: existingApp,
      reviews: existingApp.appReviews,
    };
  } catch (error) {
    console.error("Error retrieving app from database:", error);
    return null;
  }
}

/**
 * Store app data in the database
 * @param appInfo
 */
export async function storeAppData(
  appInfo: AppInfo,
  reviews: Review[],
): Promise<void> {
  try {
    // Store or update app data
    const record = await db.app.upsert({
      where: {
        appStoreId: appInfo.appId,
      },
      update: {
        name: appInfo.title,
        icon: appInfo.icon,
        developer: appInfo.developer || "",
        categories: appInfo.categories as Prisma.InputJsonValue,
        description: appInfo.description,
        score: appInfo.score,
        ratings: appInfo.ratings || 0,
        reviews: appInfo.reviews,
        histogram: appInfo.histogram ?? ({} as Prisma.InputJsonValue),
        installs: appInfo.installs,
        version: appInfo.version,
        rawData: appInfo as unknown as Prisma.InputJsonValue,
        lastFetched: new Date(),
      },
      create: {
        appStoreId: appInfo.appId,
        name: appInfo.title,
        icon: appInfo.icon,
        developer: appInfo.developer || "",
        categories: appInfo.categories as Prisma.InputJsonValue,
        description: appInfo.description,
        score: appInfo.score,
        ratings: appInfo.ratings || 0,
        reviews: appInfo.reviews,
        histogram: appInfo.histogram ?? ({} as Prisma.InputJsonValue),
        installs: appInfo.installs,
        version: appInfo.version,
        rawData: appInfo as unknown as Prisma.InputJsonValue,
      },
    });

    // Store reviews
    await storeAppReviews(record.id, reviews);
  } catch (error) {
    console.error("Error storing app data:", error);
    throw error;
  }
}

/**
 * Store app reviews in the database
 * @param appId
 * @param reviews
 */
export async function storeAppReviews(
  appId: number,
  reviews: Review[],
): Promise<void> {
  try {
    // Delete existing reviews to replace with new ones
    await db.appReview.deleteMany({
      where: { appId },
    });

    // Create all reviews in bulk
    const reviewData = reviews.map((review) => ({
      appId,
      reviewId: review.id,
      userName: review.userName,
      userImage: review.userImage ?? "",
      date: review.date,
      score: review.score,
      title: review.title ?? "",
      text: review.text,
      thumbsUp: review.thumbsUp ?? 0,
      version: review.version ?? "",
      rawData: review as unknown as Prisma.InputJsonValue,
    }));

    // Insert in batches to avoid overloading the database
    const batchSize = 100;
    for (let i = 0; i < reviewData.length; i += batchSize) {
      const batch = reviewData.slice(i, i + batchSize);
      await db.appReview.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error("Error storing app reviews:", error);
    throw error;
  }
}

/**
 * Store analysis results in the database
 * @param userId
 * @param appInfo
 * @param analysis
 * @param analysisResults
 * @returns
 */
export async function storeAnalysisResults(
  userId: string | null,
  appInfo: App,
  analysis: AppAnalysis,
  analysisResults: AnalysisResultsData,
): Promise<number> {
  try {
    // Extract review ID mappings from the raw analysis result
    const rawAnalysis = analysis as unknown as {
      strengths?: Array<{
        title: string;
        description: string;
        reviewIds?: string[];
      }>;
      weaknesses?: Array<{
        title: string;
        description: string;
        reviewIds?: string[];
      }>;
      sentiment?: {
        overall: string;
        positive: string[];
        negative: string[];
        neutral: string[];
        mixed: string[];
        reviewMap?: Record<string, string[]>;
      };
      keyFeatures?: Array<{
        feature: string;
        sentiment: number;
        mentions: number;
        reviewIds?: number[];
      }>;
    };

    // Create review ID mappings
    const strengthsReviewMap: Record<string, string[]> = {};
    const weaknessesReviewMap: Record<string, string[]> = {};

    // Extract reviewIds from strengths and weaknesses if available
    if (rawAnalysis.strengths && Array.isArray(rawAnalysis.strengths)) {
      rawAnalysis.strengths.forEach((strength) => {
        if (strength.title && strength.reviewIds) {
          strengthsReviewMap[strength.title] = strength.reviewIds;
        }
      });
    }

    if (rawAnalysis.weaknesses && Array.isArray(rawAnalysis.weaknesses)) {
      rawAnalysis.weaknesses.forEach((weakness) => {
        if (weakness.title && weakness.reviewIds) {
          weaknessesReviewMap[weakness.title] = weakness.reviewIds;
        }
      });
    }

    // Extract sentiment and feature review ID mappings
    const sentimentReviewMap = rawAnalysis.sentiment?.reviewMap ?? {};

    const featuresReviewMap: Record<string, string[]> = {};
    if (Array.isArray(rawAnalysis.keyFeatures)) {
      rawAnalysis.keyFeatures.forEach((feature) => {
        if (feature.feature && feature.reviewIds) {
          featuresReviewMap[feature.feature] = feature.reviewIds.map((id) =>
            id.toString(),
          );
        }
      });
    }

    // Create app analysis data
    const appAnalysisData = await db.appAnalysisData.create({
      data: {
        strengths: analysisResults.strengths as Prisma.InputJsonValue,
        weaknesses: analysisResults.weaknesses as Prisma.InputJsonValue,
        marketPosition: analysisResults.marketPosition,
        targetDemographic: analysisResults.targetDemographic,
        threats: analysisResults.threats as Prisma.InputJsonValue,
        opportunities: analysisResults.opportunities as Prisma.InputJsonValue,
        keyFeatures: analysis.keyFeatures as Prisma.InputJsonValue,
        pricing: analysisResults.pricing as Prisma.InputJsonValue,
        recommendations:
          analysisResults.recommendations as Prisma.InputJsonValue,
        rawAnalysis: analysis as unknown as Prisma.InputJsonValue,
        strengthsReviewMap: strengthsReviewMap as Prisma.InputJsonValue,
        weaknessesReviewMap: weaknessesReviewMap as Prisma.InputJsonValue,
        sentimentReviewMap: sentimentReviewMap as Prisma.InputJsonValue,
        featuresReviewMap: featuresReviewMap as Prisma.InputJsonValue,
      },
    });

    // Update the app with the analysis data
    await db.app.update({
      where: {
        id: appInfo.id,
      },
      data: {
        appAnalysisDataId: appAnalysisData.id,
      },
    });

    // Generate a unique slug for the analysis
    const appNameSlug = appInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = `${appNameSlug}-${Date.now()}`;

    // Create the analysis with a reference to the app
    const analysisData = await db.analysis.create({
      data: {
        userId,
        slug: uniqueSlug,
        analysisDepth: "detailed", // Use a default value
        reviewSample: 50, // Use a default value
        analysisApps: {
          create: {
            appId: appInfo.id,
            appStoreId: appInfo.appStoreId, // Use appId as appStoreId if they're the same
          },
        },
      },
    });

    return analysisData.id;
  } catch (error) {
    console.error("Error storing analysis results:", error);
    throw error;
  }
}

/**
 * Store comparison results in the database
 * @param userId
 * @param appAnalyses
 * @param comparisonData
 * @returns
 */
export async function storeComparisonResults(
  analysisId: number,
  appAnalysesIds: number[],
  comparisonData: ComparisonData,
): Promise<number> {
  try {
    // Create the comparison data
    const comparisonResult = await db.comparisonData.create({
      data: {
        analysisId,
        featureComparison:
          comparisonData.featureComparison as unknown as Prisma.InputJsonValue,
        marketPositionComparison:
          comparisonData.marketPositionComparison as Prisma.InputJsonValue,
        pricingComparison:
          comparisonData.pricingComparison as unknown as Prisma.InputJsonValue,
        userBaseComparison:
          comparisonData.userBaseComparison as Prisma.InputJsonValue,
        recommendationSummary:
          comparisonData.recommendationSummary as Prisma.InputJsonValue,
        reviews: comparisonData.reviews as unknown as Prisma.InputJsonValue,
      },
    });

    // Connect apps to the comparison data
    for (const appId of appAnalysesIds) {
      await db.app.update({
        where: { id: appId },
        data: {
          ComparisonData: {
            connect: { id: comparisonResult.id },
          },
        },
      });
    }

    return comparisonResult.id;
  } catch (error) {
    console.error("Error storing comparison results:", error);
    throw error;
  }
}

/**
 * Get analysis results from the database
 */
export async function getAnalysisResultsFromDb(
  appId: number,
  _maxAgeDays = 30,
) {
  try {
    // Find app first
    const app = await db.app.findUnique({
      where: {
        id: appId,
      },
      include: {
        analysisData: true, // Include the linked AppAnalysisData
      },
    });

    if (!app || !app.analysisData) {
      return null;
    }

    const analysisData = app.analysisData;

    // Construct the AppAnalysis object directly from structured DB fields
    const analysis: AppAnalysis = {
      appName: app.name,

      // Convert from database JSON to typed structures
      strengths: analysisData.strengths as unknown as {
        description: string;
        title: string;
        reviewIds: number[];
      }[],

      weaknesses: analysisData.weaknesses as unknown as {
        description: string;
        title: string;
        reviewIds: number[];
      }[],

      // Use keyFeatures directly - no transformation needed!
      keyFeatures: analysisData.keyFeatures as unknown as {
        feature: string;
        sentiment: "positive" | "negative" | "neutral" | "mixed";
        description: string;
        reviewIds: number[];
      }[],

      overview: {
        strengths: [],
        weaknesses: [],
        opportunities: analysisData.opportunities as unknown as string[],
        threats: analysisData.threats as unknown as string[],
        marketPosition: analysisData.marketPosition,
        targetDemographic: analysisData.targetDemographic,
      },

      // Construct sentiment from database or provide defaults
      sentiment: {
        neutral: [],
        overall: "",
        positive: [],
        negative: [],
        mixed: [],
        reviewMap: {},
      },

      pricingPerception: analysisData.pricing as unknown as {
        valueForMoney: number;
        pricingComplaints: number;
        willingness: string;
        reviewIds: number[];
      },

      recommendedActions: analysisData.recommendations as unknown as {
        action: string;
        priority: string;
        impact: string;
        timeframe?: string;
        targetSegment?: string;
      }[],
    };

    // Construct a properly structured result
    const analysisResults: AnalysisResultsData = {
      type: "analysis_results",
      appId: app.id,
      appName: app.name,
      strengths: analysisData.strengths as unknown as {
        description: string;
        title: string;
        reviewIds: number[];
      }[],
      weaknesses: analysisData.weaknesses as unknown as {
        description: string;
        title: string;
        reviewIds: number[];
      }[],
      opportunities: analysisData.opportunities as unknown as string[],
      marketPosition: analysisData.marketPosition,
      targetDemographic: analysisData.targetDemographic,
      threats: analysisData.threats as unknown as string[],
      keyFeatures: analysisData.keyFeatures as unknown as {
        feature: string;
        sentiment: "positive" | "negative" | "neutral" | "mixed";
        description: string;
        reviewIds: number[];
      }[],
      pricing: analysisData.pricing as unknown as {
        valueForMoney: string;
        pricingComplaints: number;
        willingness: string;
        reviewIds: number[];
      },
      recommendations: analysisData.recommendations as unknown as {
        action: string;
        priority: string;
        impact: string;
      }[],
    };

    // Add review mappings if they exist
    if (
      analysisData.strengthsReviewMap ||
      analysisData.weaknessesReviewMap ||
      analysisData.sentimentReviewMap ||
      analysisData.featuresReviewMap
    ) {
      analysisResults.reviewMappings = {};

      if (analysisData.strengthsReviewMap) {
        analysisResults.reviewMappings.strengthsReviewMap =
          analysisData.strengthsReviewMap as unknown as Record<
            string,
            string[] | number[]
          >;
      }

      if (analysisData.weaknessesReviewMap) {
        analysisResults.reviewMappings.weaknessesReviewMap =
          analysisData.weaknessesReviewMap as unknown as Record<
            string,
            string[] | number[]
          >;
      }

      if (analysisData.sentimentReviewMap) {
        analysisResults.reviewMappings.sentimentReviewMap =
          analysisData.sentimentReviewMap as unknown as Record<
            string,
            string[] | number[]
          >;
      }

      if (analysisData.featuresReviewMap) {
        analysisResults.reviewMappings.featuresReviewMap =
          analysisData.featuresReviewMap as unknown as Record<
            string,
            string[] | number[]
          >;
      }
    }

    return {
      appInfo: app,
      analysis: analysis,
      analysisResults: analysisResults,
    };
  } catch (error) {
    console.error("Error retrieving analysis results:", error);
    return null;
  }
}

/**
 * Get comparison results from the database
 */
export async function getComparisonResultsFromDb(
  appIds: number[],
  maxAgeDays = 30,
): Promise<{
  comparisonData: ComparisonData;
  appAnalyses: {
    appInfo: App;
    analysis: AppAnalysis;
    analysisResults: AnalysisResultsData;
  }[];
} | null> {
  try {
    if (appIds.length <= 1) {
      return null; // Comparison requires at least 2 apps
    }

    // Find analyses with these apps
    const existingAnalyses = await db.analysis.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000),
        },
        analysisApps: {
          every: {
            appId: {
              in: appIds,
            },
          },
        },
      },
      include: {
        analysisApps: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Find the most recent analysis that has comparison data
    for (const analysis of existingAnalyses) {
      const dbComparisonData = await db.comparisonData.findUnique({
        where: { analysisId: analysis.id },
      });

      if (!dbComparisonData) {
        continue;
      }

      // Get all apps for this comparison
      const appAnalyses = [];

      for (const appId of appIds) {
        // Get app with analysis data
        const app = await db.app.findUnique({
          where: { id: appId },
          include: { analysisData: true },
        });

        if (!app || !app.analysisData) {
          continue;
        }

        const appAnalysisData = app.analysisData;

        // Create the app analysis object with direct keyFeatures mapping
        const appAnalysis: AppAnalysis = {
          appName: app.name,
          strengths: appAnalysisData.strengths as unknown as {
            description: string;
            title: string;
            reviewIds: number[];
          }[],
          weaknesses: appAnalysisData.weaknesses as unknown as {
            description: string;
            title: string;
            reviewIds: number[];
          }[],
          // Use keyFeatures directly from DB
          keyFeatures: appAnalysisData.keyFeatures as unknown as {
            feature: string;
            sentiment: "positive" | "negative" | "neutral" | "mixed";
            description: string;
            reviewIds: number[];
          }[],
          overview: {
            strengths: [],
            weaknesses: [],
            opportunities: appAnalysisData.opportunities as unknown as string[],
            threats: appAnalysisData.threats as unknown as string[],
            marketPosition: appAnalysisData.marketPosition,
            targetDemographic: appAnalysisData.targetDemographic,
          },
          sentiment: {
            neutral: [],
            overall: "",
            positive: [],
            negative: [],
            mixed: [],
            reviewMap: {},
          },
          pricingPerception: appAnalysisData.pricing as unknown as {
            valueForMoney: number;
            pricingComplaints: number;
            willingness: string;
            reviewIds: number[];
          },
          recommendedActions: appAnalysisData.recommendations as unknown as {
            action: string;
            priority: string;
            impact: string;
            timeframe?: string;
            targetSegment?: string;
          }[],
        };

        // Convert the stored data to AnalysisResultsData format
        const analysisResults: AnalysisResultsData = {
          type: "analysis_results",
          appId: app.id,
          appName: app.name,
          strengths: appAnalysisData.strengths as unknown as {
            description: string;
            title: string;
            reviewIds: number[];
          }[],
          weaknesses: appAnalysisData.weaknesses as unknown as {
            description: string;
            title: string;
            reviewIds: number[];
          }[],
          marketPosition: appAnalysisData.marketPosition,
          targetDemographic: appAnalysisData.targetDemographic,
          threats: appAnalysisData.threats as unknown as string[],
          opportunities: appAnalysisData.opportunities as unknown as string[],
          keyFeatures: appAnalysisData.keyFeatures as unknown as {
            feature: string;
            sentiment: "positive" | "negative" | "neutral" | "mixed";
            description: string;
            reviewIds: number[];
          }[],
          pricing: appAnalysisData.pricing as unknown as {
            valueForMoney: string;
            pricingComplaints: number;
            willingness: string;
            reviewIds: number[];
          },
          recommendations: appAnalysisData.recommendations as unknown as {
            action: string;
            priority: string;
            impact: string;
          }[],
        };

        appAnalyses.push({
          appInfo: app as unknown as App,
          analysis: appAnalysis,
          analysisResults,
        });
      }

      const comparisonData: ComparisonData = {
        type: "comparison_results",
        apps: appAnalyses.map((app) => ({
          appName: app.appInfo.name,
          appId: app.appInfo.id,
          rating: app.appInfo.score?.toString() ?? "0",
          ratingCount: app.appInfo.ratings ?? 0,
        })),
        featureComparison:
          dbComparisonData.featureComparison as unknown as FeatureComparisonItem[],
        marketPositionComparison:
          dbComparisonData.marketPositionComparison as unknown as {
            appName: string;
            marketPosition: string;
          }[],
        pricingComparison:
          dbComparisonData.pricingComparison as unknown as PricingComparisonItem[],
        userBaseComparison: dbComparisonData.userBaseComparison as unknown as {
          appName: string;
          demographics: string;
        }[],
        recommendationSummary:
          dbComparisonData.recommendationSummary as unknown as string[],
        reviews: dbComparisonData.reviews as unknown as {
          feature: Record<string, Record<string, number[]>>;
          pricing: Record<string, number[]>;
          strengths: Record<string, number[]>;
          weaknesses: Record<string, number[]>;
        },
      };

      // If we have all the app analyses, return the comparison data
      if (appAnalyses.length === appIds.length) {
        return {
          comparisonData,
          appAnalyses,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error retrieving comparison results:", error);
    return null;
  }
}
