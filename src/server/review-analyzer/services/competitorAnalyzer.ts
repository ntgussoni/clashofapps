import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  AppInfo,
  AppAnalysis,
  CompetitorAnalysis,
  SentimentComparisonItem,
} from "../types";
import {
  marketOverviewSchema,
  competitiveAdvantagesSchema,
  featureComparisonSchema,
  sentimentComparisonSchema,
  marketGapsSchema,
  userSegmentAnalysisSchema,
  pricingAnalysisSchema,
  recommendationsSchema,
} from "../schemas";

// Configure OpenAI
const model = openai("gpt-4o-mini");

/**
 * Performs comparative analysis across multiple apps
 * @param appAnalyses - Record of app analyses indexed by app ID
 * @param appsData - Record of app information indexed by app ID
 * @param yourAppId - ID of the primary app being analyzed
 * @param analysisDepth - Depth of analysis to perform (default: "detailed")
 * @returns Promise resolving to CompetitorAnalysis result
 */
export async function performCompetitorAnalysis(
  appAnalyses: Record<string, AppAnalysis>,
  appsData: Record<string, AppInfo>,
  yourAppId: string,
  analysisDepth: string = "detailed"
): Promise<CompetitorAnalysis> {
  const appIds = Object.keys(appAnalyses);
  const appNames = Object.entries(appAnalyses).reduce((acc, [id, analysis]) => {
    acc[id] = analysis.appName;
    return acc;
  }, {} as Record<string, string>);

  // Create a base prompt for competitor analysis
  const basePrompt = `
    You are an expert app market strategist and competitive analyst. I'm planning to build a new app in this market space, and I need your help to understand the competitive landscape thoroughly.
    
    ## Market Context
    These apps all compete in the following categories: ${appsData[
      yourAppId
    ].categories.join(", ")}
    
    ## Apps analyzed
    ${appIds
      .map(
        (id) => `
    - ${appNames[id]} (${id})
      * Installs: ${appsData[id].installs}
      * Rating: ${appsData[id].appScore.toFixed(1)}/5
      * ${
        id === yourAppId ? "THIS IS THE PRIMARY APP OF INTEREST" : "Competitor"
      }
    `
      )
      .join("\n")}
    
    ## Individual App Analyses
    I'll provide you with detailed analyses for each app, and I need you to synthesize them into a competitive analysis that would help me build a successful app in this space.
    
    ${Object.entries(appAnalyses)
      .map(
        ([id, analysis]) => `
    =================
    APP: ${analysis.appName} (${id})
    =================
    
    MARKET POSITION: ${analysis.overview.marketPosition}
    
    TARGET DEMOGRAPHIC: ${analysis.overview.targetDemographic}
    
    STRENGTHS:
    ${analysis.overview.strengths.map((s: string) => `- ${s}`).join("\n")}
    
    WEAKNESSES:
    ${analysis.overview.weaknesses.map((w: string) => `- ${w}`).join("\n")}
    
    OPPORTUNITIES:
    ${analysis.overview.opportunities.map((o: string) => `- ${o}`).join("\n")}
    
    THREATS:
    ${analysis.overview.threats.map((t: string) => `- ${t}`).join("\n")}
    
    KEY FEATURES (by sentiment score -1 to 1, and mention count):
    ${analysis.featureAnalysis
      .map(
        (f: any) =>
          `- ${f.feature}: Score ${f.sentimentScore.toFixed(2)}, Mentions ${
            f.mentionCount
          }, ${f.competitiveEdge ? "✓ Competitive Edge" : "✗ Not Distinctive"}`
      )
      .join("\n")}
    
    USER SEGMENTS:
    ${analysis.userSegments
      .map(
        (s: any) =>
          `- ${s.segment} (${s.sizeProportion}% of users): Satisfaction ${s.satisfactionLevel}, Retention Risk ${s.retentionRisk}`
      )
      .join("\n")}
    
    PRICING PERCEPTION:
    - Value for Money: ${analysis.pricingPerception.valueForMoney.toFixed(
      2
    )} (-1 to 1)
    - Pricing Complaints: ${analysis.pricingPerception.pricingComplaints.toFixed(
      1
    )}%
    - Willingness to Pay: ${analysis.pricingPerception.willingness}
    `
      )
      .join("\n")}
    
    Your analysis should be ${
      analysisDepth === "comprehensive"
        ? "extremely detailed and thorough"
        : analysisDepth === "basic"
        ? "concise and focused on the most important points"
        : "balanced with moderate detail"
    }.
    
    Focus on being practical and specific - I need actionable insights, not generalities.
  `;

  // Create a function to handle potential failures in generation
  async function generateWithFallback<T extends z.ZodType>(
    schema: T,
    prompt: string,
    title: string,
    fallbackGenerator: () => z.infer<T>
  ): Promise<z.infer<T>> {
    console.log(`Generating ${title}...`);
    try {
      const { object } = await generateObject({
        model,
        maxRetries: 3,
        schema,
        prompt,
        temperature: 0.1,
      });
      return object as z.infer<T>;
    } catch (_) {
      console.warn(`Failed to generate ${title}, using fallback data`);
      return fallbackGenerator();
    }
  }

  // Generate market overview
  const marketOverview = await generateWithFallback(
    marketOverviewSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 1: Market Overview
    Based on these analyses, provide a high-level overview of the market and competitive landscape.
    Focus on the overall market dynamics, trends, and the general competitive environment.`,
    "market overview",
    () => ({
      marketOverview:
        "The market shows a mix of established players and emerging competitors with various strengths and weaknesses.",
      competitiveLandscape:
        "Competition is primarily focused on user experience, feature richness, and pricing models.",
    })
  );

  // Generate competitive advantages with improved prompt
  const competitiveAdvantages = await generateWithFallback(
    competitiveAdvantagesSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 2: Competitive Advantages
    For each app analyzed (${appIds.join(
      ", "
    )}), identify its key competitive advantages and unique selling propositions based on the reviews.
    
    You MUST provide at least 2-3 competitive advantages for EACH app, and 1-2 unique selling propositions for EACH app.
    
    Format your response as a JSON object with two main properties:
    1. "competitiveAdvantages": An object where each key is an app ID and each value is an array of strings describing that app's advantages
    2. "uniqueSellingPropositions": An object where each key is an app ID and each value is an array of strings describing that app's USPs
    
    Example format:
    {
      "competitiveAdvantages": {
        "app.id.one": ["Advantage 1", "Advantage 2"],
        "app.id.two": ["Advantage 1", "Advantage 2"]
      },
      "uniqueSellingPropositions": {
        "app.id.one": ["USP 1"],
        "app.id.two": ["USP 1"]
      }
    }`,
    "competitive advantages",
    () => {
      // Create a fallback with basic data for each app
      const advantages: Record<string, string[]> = {};
      const usps: Record<string, string[]> = {};

      appIds.forEach((id) => {
        const analysis = appAnalyses[id];
        advantages[id] = analysis.overview.strengths.slice(0, 3);
        usps[id] = [
          `${analysis.appName} offers ${
            analysis.featureAnalysis[0]?.feature || "unique features"
          } that users appreciate`,
          `${analysis.appName} targets ${analysis.overview.targetDemographic}`,
        ];
      });

      return {
        competitiveAdvantages: advantages,
        uniqueSellingPropositions: usps,
      };
    }
  );

  // Generate feature comparison
  const featureComparison = await generateWithFallback(
    featureComparisonSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 3: Feature Comparison
    Compare the key features across all apps. For each important feature:
    1. Rate how well each app implements it
    2. Provide insights on how the apps compare
    3. Indicate how important this feature is to users
    4. Note any trends or patterns in this feature area`,
    "feature comparison",
    () => {
      // Create a basic feature comparison based on the app analyses
      const features = new Set<string>();

      // Collect all features mentioned across apps
      Object.values(appAnalyses).forEach((analysis) => {
        analysis.featureAnalysis.forEach((feature) => {
          features.add(feature.feature);
        });
      });

      // Create comparison for top features
      const topFeatures = Array.from(features).slice(0, 5);
      const featureComparison = topFeatures.map((featureName) => {
        const ratings: Record<string, number> = {};

        // Assign ratings based on sentiment scores or defaults
        appIds.forEach((id) => {
          const analysis = appAnalyses[id];
          const feature = analysis.featureAnalysis.find(
            (f) => f.feature === featureName
          );
          ratings[id] = feature?.sentimentScore || 0;
        });

        return {
          feature: featureName,
          ratings,
          insights: `Apps vary in their implementation of ${featureName}`,
          marketImportance: "medium" as const,
          trendsAndPatterns: `Users increasingly expect high-quality ${featureName}`,
        };
      });

      return { featureComparison };
    }
  );

  // Generate sentiment comparison
  const sentimentComparison = await generateWithFallback(
    sentimentComparisonSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 4: Sentiment Comparison
    Compare the sentiment across all apps based on user reviews. For each app, provide:
    1. Overall sentiment score (-1 to 1)
    2. Percentage of positive, neutral, and negative reviews
    3. The trend in sentiment (improving, stable, declining, or unknown)`,
    "sentiment comparison",
    () => {
      // Create basic sentiment comparison from app analyses
      const comparison: Record<string, SentimentComparisonItem> = {};

      appIds.forEach((id) => {
        const analysis = appAnalyses[id];

        // Calculate positive/neutral/negative percentages from feature sentiments
        const sentiments = analysis.featureAnalysis.map(
          (f) => f.sentimentScore
        );
        const positive = sentiments.filter((s) => s > 0.3).length;
        const negative = sentiments.filter((s) => s < -0.3).length;
        const neutral = sentiments.length - positive - negative;

        comparison[id] = {
          overall: analysis.pricingPerception.valueForMoney, // Use as proxy for overall sentiment
          positive: (positive / sentiments.length) * 100,
          neutral: (neutral / sentiments.length) * 100,
          negative: (negative / sentiments.length) * 100,
          trend: "stable",
        };
      });

      return { sentimentComparison: comparison };
    }
  );

  // Generate market gaps
  const marketGaps = await generateWithFallback(
    marketGapsSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 5: Market Gaps
    Identify clear gaps in the market where a new app could succeed. For each gap:
    1. Describe the gap
    2. Identify the underlying user need not being met
    3. Estimate the size of the opportunity
    4. Assess the competitive barrier to entry`,
    "market gaps",
    () => ({
      marketGaps: [
        {
          description: "Simplified user experience with core functionality",
          userNeed: "Users want essential features without complexity",
          size: "medium" as const,
          competitiveBarrier: "low" as const,
        },
        {
          description: "Better integration with other services",
          userNeed: "Seamless workflow across multiple platforms",
          size: "large" as const,
          competitiveBarrier: "medium" as const,
        },
      ],
    })
  );

  // Generate user segment analysis
  const userSegmentAnalysis = await generateWithFallback(
    userSegmentAnalysisSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 6: User Segment Analysis
    Analyze different user segments and their preferences. For each important segment:
    1. Identify the segment name
    2. Determine which app currently best serves this segment
    3. List unmet needs of this segment
    4. Assess the growth potential of this segment`,
    "user segment analysis",
    () => {
      // Extract segments from app analyses
      const segments = new Set<string>();
      Object.values(appAnalyses).forEach((analysis) => {
        analysis.userSegments.forEach((segment) => {
          segments.add(segment.segment);
        });
      });

      return {
        userSegmentAnalysis: Array.from(segments)
          .slice(0, 3)
          .map((segment) => ({
            segment,
            currentLeader: appIds[0],
            unmetNeeds: ["Better customization", "More affordable pricing"],
            growthPotential: "medium" as const,
          })),
      };
    }
  );

  // Generate pricing analysis
  const pricingAnalysis = await generateWithFallback(
    pricingAnalysisSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 7: Pricing Analysis
    Analyze pricing strategies across all apps:
    1. Summarize each app's pricing model
    2. Describe how users perceive each app's pricing
    3. Identify opportunities to optimize pricing strategy`,
    "pricing analysis",
    () => {
      const comparison: Record<string, string> = {};
      const perception: Record<string, string> = {};

      appIds.forEach((id) => {
        const analysis = appAnalyses[id];
        comparison[id] = "Freemium with premium subscription options";

        const value = analysis.pricingPerception.valueForMoney;
        if (value > 0.5) {
          perception[id] = "Users find good value for money";
        } else if (value > 0) {
          perception[id] =
            "Users are satisfied but not enthusiastic about pricing";
        } else {
          perception[id] =
            "Users feel the pricing is too high for the value provided";
        }
      });

      return {
        pricingAnalysis: {
          comparison,
          userPerception: perception,
          optimizationOpportunities: [
            "Introduce a more affordable tier with core features",
            "Offer better value in premium tiers",
            "Provide more transparent pricing information",
          ],
        },
      };
    }
  );

  // Generate recommendations
  const recommendations = await generateWithFallback(
    recommendationsSchema,
    `${basePrompt}
    
    ## Analysis Request - Part 8: Strategic Recommendations
    Provide concrete, actionable recommendations for building a successful app in this space. For each recommendation:
    1. Describe the recommended action
    2. Assign a priority level (low, medium, high)
    3. Explain the reasoning behind this recommendation
    4. Identify any specific competitor this aims to counter (if applicable)
    5. Assess the implementation complexity
    6. Estimate the potential competitive impact`,
    "recommendations",
    () => ({
      recommendations: [
        {
          action: "Focus on user experience simplicity",
          priority: "high" as const,
          reasoning:
            "Users consistently mention frustration with complex interfaces across all apps",
          implementationComplexity: "medium" as const,
          potentialImpact: "high" as const,
        },
        {
          action: "Implement better cross-platform integration",
          priority: "medium" as const,
          reasoning: "Integration is a common pain point in user reviews",
          competitiveTarget: appIds[1],
          implementationComplexity: "high" as const,
          potentialImpact: "medium" as const,
        },
        {
          action: "Offer more flexible pricing tiers",
          priority: "medium" as const,
          reasoning: "Price sensitivity is evident in many reviews",
          implementationComplexity: "low" as const,
          potentialImpact: "medium" as const,
        },
      ],
    })
  );

  // Combine all parts into a complete analysis
  return {
    ...marketOverview,
    ...competitiveAdvantages,
    ...featureComparison,
    ...sentimentComparison,
    ...marketGaps,
    ...userSegmentAnalysis,
    ...pricingAnalysis,
    ...recommendations,
  } as CompetitorAnalysis;
}
