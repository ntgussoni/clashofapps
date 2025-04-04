import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { AppAnalysisResult, FeatureComparisonItem } from "@/types";
import { recommendationSchema } from "@/types";

// Function to generate AI-driven recommendations
export async function generateAIRecommendations(
  appAnalyses: AppAnalysisResult[],
  options?: { traceId?: string; userEmail?: string },
): Promise<string[]> {
  if (appAnalyses.length === 0) {
    return [];
  }

  // Prepare data for the AI
  const appSummaries = appAnalyses.map((app) => {
    // Return the app summary
    return {
      name: app.appInfo.name,
      rating: app.appInfo.score,
      strengths: app.analysis.overview?.strengths || [],
      weaknesses: app.analysis.overview?.weaknesses || [],
      opportunities: app.analysis.overview?.opportunities || [],
      threats: app.analysis.overview?.threats || [],
      marketPosition: app.analysis.overview?.marketPosition || "",
      targetDemographic: app.analysis.overview?.targetDemographic || "",
      keyFeatures: app.analysis.keyFeatures || [],
      valueForMoney: app.analysis.pricingPerception?.valueForMoney || 0,
      pricingComplaints: app.analysis.pricingPerception?.pricingComplaints || 0,
      willingness: app.analysis.pricingPerception?.willingness || "",
    };
  });

  // Extract common strengths and weaknesses without importing from comparison.ts
  // to avoid circular dependencies
  const strengthsMap = new Map<string, string[]>();
  const weaknessesMap = new Map<string, string[]>();

  // Build maps for strengths and weaknesses
  appAnalyses.forEach((analysis) => {
    const appName = analysis.appInfo.name;

    // Process strengths
    const strengths = analysis.analysis.overview?.strengths || [];
    strengths.forEach((strength: string) => {
      const key = strength.toLowerCase();
      if (!strengthsMap.has(key)) {
        strengthsMap.set(key, []);
      }
      strengthsMap.get(key)?.push(appName);
    });

    // Process weaknesses
    const weaknesses = analysis.analysis.overview?.weaknesses || [];
    weaknesses.forEach((weakness: string) => {
      const key = weakness.toLowerCase();
      if (!weaknessesMap.has(key)) {
        weaknessesMap.set(key, []);
      }
      weaknessesMap.get(key)?.push(appName);
    });
  });

  // Extract common strengths and weaknesses
  const commonStrengths = Array.from(strengthsMap.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([strength, apps]) => ({
      strength,
      apps,
    }));

  const commonWeaknesses = Array.from(weaknessesMap.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([weakness, apps]) => ({
      weakness,
      apps,
    }));

  // Build feature comparison for the prompt
  const featureMap = new Map<
    string,
    {
      scores: number[];
      mentions: number[];
      apps: string[];
    }
  >();

  appAnalyses.forEach((analysis) => {
    const appName = analysis.appInfo.name;
    const features = analysis.analysis.keyFeatures || [];

    features.forEach((feature) => {
      const featureName = feature.feature.toLowerCase();
      if (!featureMap.has(featureName)) {
        featureMap.set(featureName, { scores: [], mentions: [], apps: [] });
      }
      const featureData = featureMap.get(featureName)!;

      // Convert sentiment string to numeric score
      let sentimentScore = 0;
      switch (feature.sentiment) {
        case "positive":
          sentimentScore = 1;
          break;
        case "negative":
          sentimentScore = -1;
          break;
        case "mixed":
          sentimentScore = 0.5;
          break;
        case "neutral":
        default:
          sentimentScore = 0;
          break;
      }

      featureData.scores.push(sentimentScore);
      // Use reviewIds length as a proxy for mention count
      featureData.mentions.push(feature.reviewIds.length);
      featureData.apps.push(appName);
    });
  });

  const featureComparison: FeatureComparisonItem[] = Array.from(
    featureMap.entries(),
  )
    .map(([feature, data]) => ({
      feature,
      appCoverage: data.apps.length / appAnalyses.length,
      averageSentiment:
        data.scores.reduce((sum, score) => sum + score, 0) /
        (data.scores.length || 1),
      totalMentions: data.mentions.reduce((sum, count) => sum + count, 0),
      presentInApps: data.apps,
    }))
    .sort(
      (a, b) =>
        b.appCoverage - a.appCoverage || b.totalMentions - a.totalMentions,
    );

  // Create prompt for AI
  const prompt = `
As a product strategy expert, create a detailed 7-step action plan for building a superior mobile app that outperforms the following analyzed apps: ${appAnalyses.map((a) => a.appInfo.name).join(", ")}.

Here's a comprehensive analysis of these apps:

1. App Summaries:
${appSummaries
  .map(
    (app) => `
  - ${app.name} (Rating: ${app.rating})
    - Strengths: ${app.strengths.join(", ")}
    - Weaknesses: ${app.weaknesses.join(", ")}
    - Market Position: ${app.marketPosition}
    - Target Demographic: ${app.targetDemographic}
    - Value For Money: ${app.valueForMoney}
`,
  )
  .join("")}

2. Common Strengths Across Apps:
${commonStrengths
  .map((s) => `  - ${s.strength} (found in: ${s.apps.join(", ")})`)
  .join("\n")}

3. Common Weaknesses Across Apps:
${commonWeaknesses
  .map((w) => `  - ${w.weakness} (found in: ${w.apps.join(", ")})`)
  .join("\n")}

4. Feature Comparison across apps:
${featureComparison
  .map(
    (f) =>
      `  - ${f.feature}: Average sentiment: ${f.averageSentiment.toFixed(
        2,
      )}, Found in ${f.presentInApps.length} apps (${f.presentInApps.join(
        ", ",
      )})`,
  )
  .join("\n")}

Based on this analysis, create a comprehensive 7-step action plan for building an app that would outperform these competitors. 
Each step should consist of: specific action to take, its priority level, and expected impact. 
Focus on addressing common weaknesses while incorporating strengths, and identifying market gaps and opportunities. 
Use the feature comparison to identify the gaps and opportunities in the market.
`;

  try {
    const model = openai("gpt-4o-mini");
    const response = await generateObject({
      model,
      schema: recommendationSchema,
      prompt,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "generate-app-recommendations",
        metadata: {
          analysisType: "action-plan",
          appCount: appAnalyses.length,
          ...(options?.traceId ? { langfuseTraceId: options.traceId } : {}),
          langfuseUpdateParent: false,
          ...(options?.userEmail ? { userId: options.userEmail } : {}),
        },
      },
    });

    // Format the response into strings for the UI
    return response.object.actionPlan.map(
      (step) => `STEP ${step.step}: ${step.title}. ${step.description}`,
    );
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    throw error;
  }
}
