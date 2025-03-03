import { z } from "zod";

/**
 * Zod schemas for validating the structure of analysis results
 */

// Base sentiment schema for reuse in other schemas
export const sentimentSchema = z.object({
  score: z
    .number()
    .min(-1)
    .max(1)
    .describe("Sentiment score from -1 (negative) to 1 (positive)"),
  analysis: z.string().optional().describe("Brief analysis of the sentiment"),
  keywords: z
    .array(z.string())
    .optional()
    .describe("Sentiment-indicating keywords found"),
});

// Schema for individual review insights
export const reviewInsightSchema = z.object({
  sentiment: sentimentSchema.describe("The overall sentiment of the review"),
  features: z
    .array(
      z.object({
        name: z.string().describe("The feature being mentioned"),
        sentiment: sentimentSchema.describe(
          "The sentiment about this specific feature",
        ),
        quote: z
          .string()
          .optional()
          .describe("A relevant quote about this feature"),
        competitivePosition: z
          .enum(["leader", "parity", "laggard"])
          .optional()
          .describe("How this feature compares to industry standards"),
      }),
    )
    .describe(
      "Features mentioned in the review with their associated sentiment",
    ),
  issues: z
    .array(
      z.object({
        type: z.enum(["bug", "ux", "performance", "feature-request", "other"]),
        description: z.string().describe("Brief description of the issue"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("How severe is this issue to the user"),
        impact: z.string().optional().describe("Business impact of this issue"),
      }),
    )
    .optional()
    .describe("Any issues or problems mentioned in the review"),
  keywords: z
    .array(z.string())
    .describe("Key terms or concepts mentioned in the review"),
  userProfile: z
    .object({
      segment: z.string().optional().describe("Likely user segment"),
      usagePattern: z
        .enum(["casual", "regular", "power", "unknown"])
        .optional(),
      priceConsciousness: z
        .enum(["low", "medium", "high", "unknown"])
        .optional(),
    })
    .optional()
    .describe("Profile of the user based on review content"),
});

// Schema for complete app analysis
export const appAnalysisSchema = z.object({
  appName: z.string().describe("The name of the app"),
  overview: z
    .object({
      strengths: z
        .array(z.string())
        .describe("Key strengths of the app based on reviews"),
      weaknesses: z
        .array(z.string())
        .describe("Key weaknesses of the app based on reviews"),
      opportunities: z
        .array(z.string())
        .describe("Potential opportunities for improvement"),
      threats: z
        .array(z.string())
        .describe("Competitive threats or external challenges"),
      marketPosition: z.string().describe("Current position in the market"),
      targetDemographic: z.string().describe("Main user demographic"),
    })
    .describe("SWOT analysis for the app"),
  featureAnalysis: z
    .array(
      z.object({
        feature: z.string().describe("Name of the feature"),
        sentimentScore: z
          .number()
          .min(-1)
          .max(1)
          .describe("Average sentiment score from -1 to 1"),
        mentionCount: z
          .number()
          .describe("Number of times this feature was mentioned"),
        commonFeedback: z
          .string()
          .describe("Common themes in feedback about this feature"),
        competitiveEdge: z
          .boolean()
          .describe("Whether this feature provides a competitive edge"),
        marketDifferentiator: z
          .boolean()
          .describe("Whether this feature is a market differentiator"),
        improvementPriority: z
          .enum(["low", "medium", "high"])
          .describe("Priority for improvement"),
      }),
    )
    .describe("Analysis of major features mentioned in reviews"),
  userSegments: z
    .array(
      z.object({
        segment: z
          .string()
          .describe("Type of user (e.g., 'power user', 'casual', 'business')"),
        needs: z
          .array(z.string())
          .describe("Common needs of this user segment"),
        painPoints: z
          .array(z.string())
          .describe("Common pain points for this user segment"),
        sizeProportion: z
          .number()
          .min(0)
          .max(100)
          .describe("Estimated % of user base"),
        satisfactionLevel: z
          .enum(["low", "medium", "high"])
          .describe("Overall satisfaction level"),
        retentionRisk: z
          .enum(["low", "medium", "high"])
          .describe("Risk of churning"),
      }),
    )
    .default([])
    .optional()
    .describe("Different user segments identified from review analysis"),
  competitiveInsights: z
    .array(z.string())
    .default([])
    .optional()
    .describe("Key insights about competitive positioning"),
  pricingPerception: z
    .object({
      valueForMoney: z
        .number()
        .min(-1)
        .max(1)
        .describe("Perception of value for money (-1 to 1)"),
      pricingComplaints: z
        .number()
        .describe("Frequency of pricing complaints (%)"),
      willingness: z
        .enum(["low", "medium", "high"])
        .describe("User willingness to pay"),
    })
    .describe("Analysis of pricing perceptions from reviews"),
  recommendedActions: z
    .array(
      z.object({
        action: z.string().describe("Recommended action"),
        priority: z.enum(["low", "medium", "high"]).describe("Action priority"),
        impact: z.enum(["low", "medium", "high"]).describe("Potential impact"),
        timeframe: z
          .enum(["short", "medium", "long"])
          .describe("Implementation timeframe"),
        targetSegment: z
          .string()
          .optional()
          .describe("Target user segment if applicable"),
      }),
    )
    .default([])
    .describe("Recommended actions based on review analysis"),
});

// Competitive analysis schemas split by section for better maintainability
export const marketOverviewSchema = z.object({
  marketOverview: z
    .string()
    .describe("Overall assessment of the market based on all apps analyzed"),
  competitiveLandscape: z
    .string()
    .describe("Analysis of the competitive landscape and market dynamics"),
});

export const competitiveAdvantagesSchema = z.object({
  competitiveAdvantages: z
    .record(
      z.string(), // App ID or name
      z.array(z.string()), // List of advantages
    )
    .describe("Key advantages each app has according to reviews")
    .default({}),
  uniqueSellingPropositions: z
    .record(
      z.string(), // App ID or name
      z.array(z.string()), // List of USPs
    )
    .describe("Unique selling propositions of each app")
    .default({}),
});

export const featureComparisonSchema = z.object({
  featureComparison: z
    .array(
      z.object({
        feature: z.string().describe("Name of the feature"),
        ratings: z
          .record(
            z.string(), // App ID or name
            z.number().min(-1).max(1), // Sentiment rating from -1 to 1
          )
          .describe("Rating of this feature for each app"),
        insights: z
          .string()
          .describe("Insights about how apps compare on this feature"),
        marketImportance: z
          .enum(["low", "medium", "high"])
          .describe("How important this feature is to users"),
        trendsAndPatterns: z
          .string()
          .optional()
          .describe("Any noticeable trends in this feature area"),
      }),
    )
    .describe("Comparison of key features across apps"),
});

export const sentimentComparisonSchema = z.object({
  sentimentComparison: z
    .record(
      z.string(), // App ID or name
      z.object({
        overall: z.number().min(-1).max(1).describe("Overall sentiment score"),
        positive: z.number().describe("Percentage of positive reviews"),
        neutral: z.number().describe("Percentage of neutral reviews"),
        negative: z.number().describe("Percentage of negative reviews"),
        trend: z
          .enum(["improving", "stable", "declining", "unknown"])
          .describe("Sentiment trend"),
      }),
    )
    .describe("Comparison of sentiment across apps"),
});

export const marketGapsSchema = z.object({
  marketGaps: z
    .array(
      z.object({
        description: z.string().describe("Description of the market gap"),
        userNeed: z.string().describe("Underlying user need not being met"),
        size: z
          .enum(["small", "medium", "large"])
          .describe("Estimated size of the opportunity"),
        competitiveBarrier: z
          .enum(["low", "medium", "high"])
          .describe("Barrier to entry"),
      }),
    )
    .describe("Identified gaps in the market that represent opportunities"),
});

export const userSegmentAnalysisSchema = z.object({
  userSegmentAnalysis: z
    .array(
      z.object({
        segment: z.string().describe("User segment name"),
        currentLeader: z.string().describe("App that best serves this segment"),
        unmetNeeds: z.array(z.string()).describe("Unmet needs of this segment"),
        growthPotential: z
          .enum(["low", "medium", "high"])
          .describe("Growth potential of this segment"),
      }),
    )
    .describe("Analysis of different user segments and their preferences"),
});

export const pricingAnalysisSchema = z.object({
  pricingAnalysis: z
    .object({
      comparison: z
        .record(z.string(), z.string())
        .describe("Summary of each app's pricing model"),
      userPerception: z
        .record(z.string(), z.string())
        .describe("How users perceive each app's pricing"),
      optimizationOpportunities: z
        .array(z.string())
        .describe("Ways to optimize pricing strategy"),
    })
    .describe("Analysis of pricing models across competitors"),
});

export const recommendationsSchema = z.object({
  recommendations: z
    .array(
      z.object({
        action: z.string().describe("Recommended action"),
        priority: z.enum(["low", "medium", "high"]).describe("Priority level"),
        reasoning: z.string().describe("Reasoning behind this recommendation"),
        competitiveTarget: z
          .string()
          .optional()
          .describe("Specific competitor this aims to counter"),
        implementationComplexity: z
          .enum(["low", "medium", "high"])
          .describe("Complexity to implement"),
        potentialImpact: z
          .enum(["low", "medium", "high"])
          .describe("Potential competitive impact"),
      }),
    )
    .describe("Recommended actions based on competitive analysis"),
});

// Combined competitor analysis schema for complete analysis
export const competitorAnalysisSchema = z.object({
  ...marketOverviewSchema.shape,
  ...competitiveAdvantagesSchema.shape,
  ...featureComparisonSchema.shape,
  ...sentimentComparisonSchema.shape,
  ...marketGapsSchema.shape,
  ...userSegmentAnalysisSchema.shape,
  ...pricingAnalysisSchema.shape,
  ...recommendationsSchema.shape,
});
