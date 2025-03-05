import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { AppAnalysisResult } from "./types";
import { recommendationSchema } from "./types";

// Function to generate AI-driven recommendations
export async function generateAIRecommendations(
  appAnalyses: AppAnalysisResult[],
): Promise<string[]> {
  if (appAnalyses.length === 0) {
    return [];
  }

  // Prepare data for the AI
  const appSummaries = appAnalyses.map((app) => ({
    name: app.appInfo.name,
    rating: app.appInfo.score,
    ...app.analysis.overview,
    topFeatures: app.analysis.featureAnalysis.map((f) => ({
      feature: f.feature,
      sentiment: f.sentimentScore,
      mentions: f.mentionCount,
    })),
    ...app.analysis.pricingPerception,
  }));

  // Extract common strengths and weaknesses without importing from comparison.ts
  // to avoid circular dependencies
  const strengthsMap = new Map<string, string[]>();
  const weaknessesMap = new Map<string, string[]>();

  // Build maps for strengths and weaknesses
  appAnalyses.forEach((analysis) => {
    const appName = analysis.appInfo.name;

    // Process strengths
    analysis.analysis.overview.strengths.forEach((strength: string) => {
      const key = strength.toLowerCase();
      if (!strengthsMap.has(key)) {
        strengthsMap.set(key, []);
      }
      strengthsMap.get(key)!.push(appName);
    });

    // Process weaknesses
    analysis.analysis.overview.weaknesses.forEach((weakness: string) => {
      const key = weakness.toLowerCase();
      if (!weaknessesMap.has(key)) {
        weaknessesMap.set(key, []);
      }
      weaknessesMap.get(key)!.push(appName);
    });
  });

  // Extract common strengths (those appearing in more than one app)
  const commonStrengths = Array.from(strengthsMap.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([strength]) => strength);

  // Extract common weaknesses (those appearing in more than one app)
  const commonWeaknesses = Array.from(weaknessesMap.entries())
    .filter(([, apps]) => apps.length > 1)
    .map(([weakness]) => weakness);

  // Feature information - directly calculate feature comparison without importing
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
    analysis.analysis.featureAnalysis.forEach((feature) => {
      const featureName = feature.feature.toLowerCase();
      if (!featureMap.has(featureName)) {
        featureMap.set(featureName, { scores: [], mentions: [], apps: [] });
      }
      const featureData = featureMap.get(featureName)!;
      featureData.scores.push(feature.sentimentScore);
      featureData.mentions.push(feature.mentionCount);
      featureData.apps.push(appName);
    });
  });

  // Convert to array and sort by number of apps and then by total mentions
  const featureComparison = Array.from(featureMap.entries())
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
    )
    .slice(0, 5); // Just take top 5 features for the prompt

  // Create prompt for AI
  const prompt = `
As a product strategy expert, create a detailed 7-step action plan for building a superior mobile app that outperforms the following analyzed apps: ${appAnalyses.map((a) => a.appInfo.name).join(", ")}.

Here's a comprehensive analysis of these apps:

APP INFORMATION:
${JSON.stringify(appSummaries, null, 2)}

COMMON STRENGTHS ACROSS APPS:
${JSON.stringify(commonStrengths, null, 2)}

COMMON WEAKNESSES ACROSS APPS:
${JSON.stringify(commonWeaknesses, null, 2)}

FEATURE COMPARISON:
${JSON.stringify(featureComparison, null, 2)}

Based on this analysis, create a strategic step-by-step action plan that would help entrepreneurs build a better app than any of these. Each step should be specific, actionable, and focused on creating competitive advantages. The steps should cover:

1. Key strengths to incorporate
2. Industry-wide pain points to solve
3. Features to prioritize
4. Target demographics to focus on
5. Pricing strategy recommendations
6. Market positioning guidance
7. User experience design principles

For each step, provide a concise title and a detailed explanation of what to do and why it matters.
`;

  try {
    // Generate recommendations using AI
    const model = openai("gpt-4o-mini");
    const response = await generateObject({
      model,
      schema: recommendationSchema,
      prompt,
      experimental_telemetry: {
        isEnabled: true,
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
