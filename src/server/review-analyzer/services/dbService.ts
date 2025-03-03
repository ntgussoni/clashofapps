import { db } from "@/server/db";
import type { AppAnalysis, AppInfo, Review } from "../types";
import type { AnalysisResultsData, ComparisonData } from "@/app/api/chat/route";
import { App, AppReview, Prisma } from "@prisma/client";

/**
 * Get app data from database or return null if not found or expired
 * @param appId
 * @param maxAgeDays
 * @returns
 */
export async function getAppFromDb(appId: string, maxAgeDays = 30) {
  // Check if app exists in database and is fresh (less than specified days old)
  try {
    const existingApp = await db.app.findFirst({
      where: {
        appId,
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
    await db.app.upsert({
      where: {
        appId: appInfo.appId,
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
        appId: appInfo.appId,
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
    await storeAppReviews(appInfo.appId, reviews);
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
  appId: string,
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
): Promise<string> {
  try {
    const analysisData = await db.analysis.create({
      data: {
        userId,
        title: `${appInfo.name} Analysis`,
        analysisDepth: "detailed", // Use a default value
        reviewSample: 50, // Use a default value
        analysisApps: {
          create: {
            appId: appInfo.appId,
            isMainApp: true,
          },
        },
        singleAnalyses: {
          create: {
            appId: appInfo.appId,
            strengths: analysisResults.strengths as Prisma.InputJsonValue,
            weaknesses: analysisResults.weaknesses as Prisma.InputJsonValue,
            marketPosition: analysisResults.marketPosition,
            userDemographics: analysisResults.userDemographics,
            topFeatures: analysisResults.topFeatures as Prisma.InputJsonValue,
            pricing: analysisResults.pricing as Prisma.InputJsonValue,
            recommendations:
              analysisResults.recommendations as Prisma.InputJsonValue,
            rawAnalysis: analysis as Prisma.InputJsonValue,
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
  userId: string | null,
  appAnalyses: {
    appInfo: App;
    analysis: AppAnalysis;
    analysisResults: AnalysisResultsData;
  }[],
  comparisonData: ComparisonData,
): Promise<string> {
  try {
    const analysisData = await db.analysis.create({
      data: {
        userId,
        title: `Comparison of ${appAnalyses.map((a) => a.appInfo.name).join(", ")}`,
        analysisApps: {
          create: appAnalyses.map((app) => ({
            appId: app.appInfo.appId,
            isMainApp: false,
          })),
        },
        singleAnalyses: {
          create: appAnalyses.map((app) => ({
            appId: app.appInfo.appId,
            strengths: app.analysisResults.strengths as Prisma.InputJsonValue,
            weaknesses: app.analysisResults.weaknesses as Prisma.InputJsonValue,
            marketPosition: app.analysisResults.marketPosition,
            userDemographics: app.analysisResults.userDemographics,
            topFeatures: app.analysisResults
              .topFeatures as Prisma.InputJsonValue,
            pricing: app.analysisResults.pricing as Prisma.InputJsonValue,
            recommendations: app.analysisResults
              .recommendations as Prisma.InputJsonValue,
            rawAnalysis: app.analysis as Prisma.InputJsonValue,
          })),
        },
        comparison: {
          create: {
            apps: comparisonData.apps as Prisma.InputJsonValue,
            featureComparison:
              comparisonData.featureComparison as unknown as Prisma.InputJsonValue,
            strengthsComparison:
              comparisonData.strengthsComparison as Prisma.InputJsonValue,
            weaknessesComparison:
              comparisonData.weaknessesComparison as Prisma.InputJsonValue,
            marketPositionComparison:
              comparisonData.marketPositionComparison as Prisma.InputJsonValue,
            pricingComparison:
              comparisonData.pricingComparison as Prisma.InputJsonValue,
            userBaseComparison:
              comparisonData.userBaseComparison as Prisma.InputJsonValue,
            recommendationSummary:
              comparisonData.recommendationSummary as Prisma.InputJsonValue,
            rawComparisonData:
              comparisonData as unknown as Prisma.InputJsonValue,
          },
        },
      },
    });

    return analysisData.id;
  } catch (error) {
    console.error("Error storing comparison results:", error);
    throw error;
  }
}

/**
 * Get the most recent analysis results for an app from the database
 * @param appId The app ID to retrieve analysis for
 * @param maxAgeDays The maximum age of the analysis in days (default: 30)
 * @returns Analysis data or null if not found or expired
 */
export async function getAnalysisResultsFromDb(appId: string, maxAgeDays = 30) {
  try {
    // Find the most recent analysis containing this app
    const analysisApp = await db.analysisApp.findFirst({
      where: {
        appId,
        analysis: {
          createdAt: {
            gte: new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000),
          },
        },
      },
      orderBy: {
        analysis: {
          createdAt: "desc",
        },
      },
      include: {
        analysis: {
          include: {
            singleAnalyses: {
              where: {
                appId,
              },
            },
          },
        },
      },
    });

    if (!analysisApp || !analysisApp.analysis.singleAnalyses.length) {
      return null;
    }

    const singleAnalysis = analysisApp.analysis.singleAnalyses[0];

    // Ensure singleAnalysis exists before proceeding
    if (!singleAnalysis) {
      return null;
    }

    // Convert the stored data back to the expected format
    const analysisResults: AnalysisResultsData = {
      type: "analysis_results",
      appId: appId,
      appName: "", // Will be filled in by the app data
      strengths: singleAnalysis.strengths as unknown as string[],
      weaknesses: singleAnalysis.weaknesses as unknown as string[],
      marketPosition: singleAnalysis.marketPosition,
      userDemographics: singleAnalysis.userDemographics,
      topFeatures: singleAnalysis.topFeatures as unknown as {
        feature: string;
        sentiment: string;
        mentions: number;
      }[],
      pricing: singleAnalysis.pricing as unknown as {
        valueForMoney: string;
        pricingComplaints: string;
        willingness: string;
      },
      recommendations: singleAnalysis.recommendations as unknown as {
        action: string;
        priority: string;
        impact: string;
      }[],
    };

    const rawAnalysis = singleAnalysis.rawAnalysis as unknown as AppAnalysis;

    return {
      analysisResults,
      analysis: rawAnalysis,
    };
  } catch (error) {
    console.error("Error retrieving analysis results from database:", error);
    return null;
  }
}

/**
 * Get the most recent comparison results for multiple apps from the database
 * @param appIds The app IDs to retrieve comparison for
 * @param maxAgeDays The maximum age of the comparison in days (default: 30)
 * @returns Comparison data or null if not found or expired
 */
export async function getComparisonResultsFromDb(
  appIds: string[],
  maxAgeDays = 30,
) {
  try {
    if (appIds.length <= 1) {
      return null; // Comparison requires at least 2 apps
    }

    // Find analyses that contain all the requested app IDs
    const analysesWithAllApps = await db.analysis.findMany({
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
        comparison: true,
        singleAnalyses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Find the most recent analysis that contains a comparison
    const analysisWithComparison = analysesWithAllApps.find(
      (analysis) => analysis.comparison !== null,
    );

    if (!analysisWithComparison || !analysisWithComparison.comparison) {
      return null;
    }

    // Convert the stored data back to the expected format
    const comparisonData = analysisWithComparison.comparison
      .rawComparisonData as unknown as ComparisonData;

    // Create AppAnalysisResult objects from single analyses
    const appAnalyses = analysisWithComparison.singleAnalyses.map(
      (singleAnalysis) => {
        const appId = singleAnalysis.appId;
        const rawAnalysis =
          singleAnalysis.rawAnalysis as unknown as AppAnalysis;

        // Convert the stored data to AnalysisResultsData format
        const analysisResults: AnalysisResultsData = {
          type: "analysis_results",
          appId: appId,
          appName: rawAnalysis.appName,
          strengths: singleAnalysis.strengths as unknown as string[],
          weaknesses: singleAnalysis.weaknesses as unknown as string[],
          marketPosition: singleAnalysis.marketPosition,
          userDemographics: singleAnalysis.userDemographics,
          topFeatures: singleAnalysis.topFeatures as unknown as {
            feature: string;
            sentiment: string;
            mentions: number;
          }[],
          pricing: singleAnalysis.pricing as unknown as {
            valueForMoney: string;
            pricingComplaints: string;
            willingness: string;
          },
          recommendations: singleAnalysis.recommendations as unknown as {
            action: string;
            priority: string;
            impact: string;
          }[],
        };

        return {
          appInfo: { appId } as App, // Minimal app info, will be filled in from app data
          analysis: rawAnalysis,
          analysisResults,
        };
      },
    );

    return {
      comparisonData,
      appAnalyses,
    };
  } catch (error) {
    console.error("Error retrieving comparison results from database:", error);
    return null;
  }
}
