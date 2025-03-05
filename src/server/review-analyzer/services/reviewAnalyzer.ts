import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import type { AppAnalysis } from "../types";
import { appAnalysisSchema } from "../schemas";
import { type App, type AppReview } from "@prisma/client";
import { z } from "zod";

// Configure OpenAI
const model = openai("gpt-4o-mini");

export type AnalysisUpdate = {
  type: string;
  status?: string;
  message?: string;
  progress?: number;
  data?: Record<string, unknown>;
};

// Schemas for AI-generated analysis results
const strengthWeaknessSchema = z
  .object({
    strengths: z
      .array(
        z.object({
          title: z.string().describe("Title summarizing the strength"),
          description: z
            .string()
            .describe("Detailed description of the strength with evidence"),
        }),
      )
      .describe("Array of key strengths identified from reviews"),
    weaknesses: z
      .array(
        z.object({
          title: z.string().describe("Title summarizing the weakness"),
          description: z
            .string()
            .describe("Detailed description of the weakness with evidence"),
        }),
      )
      .describe("Array of key weaknesses identified from reviews"),
  })
  .describe("Schema for strengths and weaknesses analysis");

const sentimentAnalysisSchema = z
  .object({
    overall: z
      .string()
      .describe(
        "Overall sentiment assessment (positive/negative/neutral/mixed)",
      ),
    positive: z
      .array(z.string())
      .default([])
      .describe("Key positive themes mentioned in reviews"),
    negative: z
      .array(z.string())
      .default([])
      .describe("Key negative themes mentioned in reviews"),
    neutral: z
      .array(z.string())
      .default([])
      .describe("Neutral or factual observations from reviews"),
    mixed: z
      .array(z.string())
      .default([])
      .describe("Mixed or unclear sentiment from reviews"),
  })
  .describe("Schema for sentiment analysis results");

const keyFeaturesSchema = z
  .object({
    features: z
      .array(
        z.object({
          name: z.string().describe("Name of the feature"),
          sentiment: z
            .enum(["positive", "negative", "neutral", "mixed"])
            .describe("Overall sentiment toward this feature"),
          description: z
            .string()
            .describe("Summary of user opinions about this feature"),
        }),
      )
      .describe("Array of key features mentioned in reviews"),
  })
  .describe("Schema for feature analysis results");

/**
 * Generator function that performs app review analysis while yielding status updates
 * This unified function replaces the previous analyzeReviews and streamingAnalyzeReviews functions
 * @param appInfo - Object containing app information and reviews
 * @param options - Configuration options for the analysis
 * @yields Status updates and intermediate results during analysis
 * @returns The final complete analysis result
 */
export async function* analyzeAppReviews(
  appInfo: App,
  reviews: AppReview[],
  options: {
    sampleSize?: number;
    analysisDepth?: "basic" | "detailed" | "comprehensive";
  } = {},
): AsyncGenerator<AnalysisUpdate | AppAnalysis> {
  try {
    const sampleSize = options.sampleSize ?? 50;
    const analysisDepth = options.analysisDepth ?? "detailed";

    // Initialize analysis
    yield {
      type: "status",
      status: "initializing",
      message: `Starting analysis of ${appInfo.name}...`,
      progress: 0,
      data: {
        appId: appInfo.appId,
        appName: appInfo.name,
        appScore: appInfo.score,
        reviewCount: appInfo.reviews,
      },
    };

    // Take a representative sample of reviews
    const reviewSample = reviews.slice(0, Math.min(sampleSize, reviews.length));

    // Categorize reviews by rating for more balanced analysis
    const reviewsByRating: Record<number, AppReview[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    reviewSample.forEach((review) => {
      const score = review.score ?? 3;
      if (reviewsByRating[score]) {
        reviewsByRating[score].push(review);
      }
    });

    // Provide rating distribution update
    yield {
      type: "status",
      status: "processing",
      message: "Categorizing reviews by rating...",
      progress: 10,
      data: {
        reviewDistribution: {
          oneStar: reviewsByRating[1]?.length ?? 0,
          twoStar: reviewsByRating[2]?.length ?? 0,
          threeStar: reviewsByRating[3]?.length ?? 0,
          fourStar: reviewsByRating[4]?.length ?? 0,
          fiveStar: reviewsByRating[5]?.length ?? 0,
        },
      },
    };

    // Ensure we have a balanced sample that includes more critical reviews
    const balancedSample: AppReview[] = [];
    // Always include more low ratings for thorough analysis
    const targetDistribution = {
      1: Math.min(10, reviewsByRating[1]?.length ?? 0),
      2: Math.min(10, reviewsByRating[2]?.length ?? 0),
      3: Math.min(10, reviewsByRating[3]?.length ?? 0),
      4: Math.min(15, reviewsByRating[4]?.length ?? 0),
      5: Math.min(15, reviewsByRating[5]?.length ?? 0),
    };

    Object.entries(targetDistribution).forEach(([rating, count]) => {
      const ratingNumber = Number(rating);
      if (reviewsByRating[ratingNumber]) {
        balancedSample.push(...reviewsByRating[ratingNumber].slice(0, count));
      }
    });

    // If we haven't reached our sample size, add more reviews
    if (balancedSample.length < sampleSize) {
      const remaining = reviewSample.filter(
        (review) => !balancedSample.some((r) => r.id === review.id),
      );
      balancedSample.push(
        ...remaining.slice(0, sampleSize - balancedSample.length),
      );
    }

    // Update on sample creation
    yield {
      type: "status",
      status: "processing",
      message: "Created balanced review sample...",
      progress: 20,
      data: {
        sampleSize: balancedSample.length,
      },
    };

    // Create a prompt for review analysis
    const prompt = `
      You are an expert app market analyst specializing in competitive analysis. You need to analyze a set of user reviews for the app "${
        appInfo.name
      }".
      
      ## App Context
      - App Name: ${appInfo.name}
      - Categories: ${(
        appInfo.categories as Array<{ name: string; id: string | null }>
      )
        .map((c) => c.name)
        .join(", ")}
      - Current Version: ${appInfo.version}
      - Last Updated: ${new Date(appInfo.updatedAt).toISOString().split("T")[0]}
      - Installs: ${appInfo.installs}
      - Overall Rating: ${appInfo.score.toFixed(1)}/5
      
      ## App Description
      ${appInfo.description.slice(0, 500)}...
      
      ## Analysis Goal
      I need you to identify this app's key strengths and weaknesses based on user reviews.
      Focus on what users love and hate about this app, paying special attention to specific features,
      user segments, and areas where this app might be vulnerable to competition.
      Be brutally honest in your assessment - I'm looking to build a competitive app, so I need
      to understand where I can outperform this existing solution.
      
      ## Reviews to Analyze
      I'm providing a balanced sample of ${
        balancedSample.length
      } reviews across different ratings:
    `;

    // Format reviews for the prompt
    const formattedReviews = balancedSample.map(
      (review, i) => `
      Review #${i + 1} (${review.score}):
      ${review.text}
      `,
    );

    const completePrompt = `${prompt}\n${formattedReviews.join("\n")}\n
      ## Analysis Instructions
      Based on these reviews, provide a structured analysis that covers:
      
      1. App Strengths: What users consistently praise about this app (features, UX, etc.)
      2. App Weaknesses: Pain points, bugs, and feature requests
      3. Market Position: How this app positions itself and its unique value proposition
      4. User Demographics: What kinds of users seem to be using this app
      5. Feature Analysis: Top features mentioned and sentiment around them
      6. Pricing Analysis: 
         - Value for Money: Do users feel they're getting value?
         - Pricing complaints: Are there specific issues with pricing?
         - Willingness to Pay: For what features would users pay more?
      7. Strategic Recommendations: What should a competing app do to outperform this one?
      
      Be comprehensive, insightful and brutally honest. Your analysis should have the depth of ${analysisDepth} analysis.
    `;

    // Status update for sending to AI
    yield {
      type: "status",
      status: "processing",
      message: "Sending review data to AI for analysis...",
      progress: 30,
    };

    // Prepare for analysis timing
    const analysisStartTime = Date.now();

    // Generate structured analysis using schema
    const analysisResponse = await generateObject({
      model,
      schema: appAnalysisSchema,
      prompt: completePrompt,
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    const analysisEndTime = Date.now();
    const analysisDuration = (analysisEndTime - analysisStartTime) / 1000;

    // Signal the AI is processing the data
    yield {
      type: "status",
      status: "processing",
      message: `AI analyzing reviews... (took ${analysisDuration.toFixed(1)} seconds)`,
      progress: 60,
    };

    // Cast the result to AppAnalysis to work with it properly
    const analysis = analysisResponse.object;

    // Final processing
    yield {
      type: "status",
      status: "completing",
      message: "Finalizing analysis...",
      progress: 95,
    };

    // Replace strength/weakness extraction with AI processing
    const aiAnalysis = await analyzeReviews(balancedSample);
    // Return the complete analysis as the final yield value
    yield {
      ...analysis,
      ...aiAnalysis,
    };
  } catch (error: unknown) {
    // If there's an error during processing, yield the error and throw
    yield {
      type: "error",
      message: `Error analyzing reviews: ${error instanceof Error ? error.message : "Unknown error"}`,
      data: { error },
    };
    throw error;
  }
}

// Main review analysis function
export async function analyzeReviews(reviews: AppReview[]) {
  const filteredReviews = reviews.filter(
    (review) => review.text && review.text.length > 10,
  );

  if (filteredReviews.length === 0) {
    return {
      strengths: [],
      weaknesses: [],
      sentiment: {
        overall: "neutral",
        positive: [],
        negative: [],
        neutral: [],
        mixed: [],
      },
      keyFeatures: { features: [] },
    };
  }

  // Run analyses in parallel for better performance
  const [strengthsAndWeaknesses, sentiment, keyFeatures] = await Promise.all([
    extractStrengthsAndWeaknesses(filteredReviews),
    analyzeSentiment(filteredReviews),
    extractKeyFeatures(filteredReviews),
  ]);

  return {
    strengths: strengthsAndWeaknesses.strengths,
    weaknesses: strengthsAndWeaknesses.weaknesses,
    sentiment,
    keyFeatures,
  };
}

// Extract strengths and weaknesses using AI
export async function extractStrengthsAndWeaknesses(reviews: AppReview[]) {
  if (reviews.length === 0) {
    return { strengths: [], weaknesses: [] };
  }

  const reviewSummary = reviews.map((r) => ({
    content: r.text,
    score: r.score,
  }));

  const result = await generateObject({
    model,
    prompt: `
      Analyze these app reviews and identify the key strengths and weaknesses:
      ${JSON.stringify(reviewSummary)}
      
      Extract the 5 most significant strengths and 5 most significant weaknesses based on user feedback.
      Focus on recurring themes, feature mentions, and pain points expressed by users.
      For each strength and weakness, provide a concise title and a detailed description that explains
      the issue with evidence from the reviews.
    `,
    schema: strengthWeaknessSchema,
    experimental_telemetry: {
      isEnabled: true,
    },
  });

  return result.object;
}

// Analyze sentiment using AI
export async function analyzeSentiment(reviews: AppReview[]) {
  if (reviews.length === 0) {
    return {
      overall: "neutral",
      positive: [],
      negative: [],
      neutral: [],
      mixed: [],
    };
  }

  const reviewTexts = reviews.map((r) => r.text);

  const result = await generateObject({
    model,
    prompt: `
      Analyze the sentiment of these app reviews:
      ${JSON.stringify(reviewTexts)}
      
      Provide:
      1. An overall sentiment assessment (positive, negative, or neutral, or mixed)
      2. Key positive themes mentioned in the reviews
      3. Key negative themes mentioned in the reviews
      4. Any neutral or factual observations made by users
    `,
    schema: sentimentAnalysisSchema,
    experimental_telemetry: {
      isEnabled: true,
    },
  });

  return result.object;
}

// Extract key features using AI
export async function extractKeyFeatures(reviews: AppReview[]) {
  if (reviews.length === 0) {
    return { features: [] };
  }

  const reviewSummary = reviews.map((r) => ({
    content: r.text,
    score: r.score,
  }));

  const result = await generateObject({
    model,
    prompt: `
      Analyze these app reviews and identify the key features mentioned by users:
      ${JSON.stringify(reviewSummary)}
      
      For each feature:
      1. Provide the feature name
      2. Determine the overall sentiment toward this feature (positive, negative, or neutral)
      3. Write a concise description of user opinions about this feature
      
      Identify up to 10 distinct features that appear most frequently in the reviews.
    `,
    schema: keyFeaturesSchema,
    experimental_telemetry: {
      isEnabled: true,
    },
  });

  return result.object;
}

// Helper function for any specialized text processing if needed
export function preprocessReviewText(text: string): string {
  if (!text) return "";

  // Basic cleaning - remove extra spaces, normalize line breaks
  return text.trim().replace(/\s+/g, " ").replace(/\n+/g, " ");
}
