import { z } from "zod";
import type * as Gplay from "google-play-scraper";
import type { JSONValue } from "ai";
import type { App } from "@prisma/client";

// Import schemas from their source files - now using unified schemas
import { type sentimentSchema } from "./sentiment-schema";
import { type reviewInsightSchema } from "./review-schema";
import { type competitorAnalysisSchema, type appAnalysisSchema } from "@/server/review-analyzer/schemas";

// Schema-based types
export type SentimentType = z.infer<typeof sentimentSchema>;
export type ReviewInsightType = z.infer<typeof reviewInsightSchema>;
export type CompetitorAnalysis = z.infer<typeof competitorAnalysisSchema>;
export type AppAnalysisSchema = z.infer<typeof appAnalysisSchema>;

// ----------------------------------------------------------------------
// Google Play Scraper Types (External Types)
// ----------------------------------------------------------------------

export type Review = Gplay.IReviewsItem;
export type AppInfo = Gplay.IAppItemFullDetail;

// ----------------------------------------------------------------------
// Core App and Data Stream Types
// ----------------------------------------------------------------------

export interface DataStream {
  writeData: (data: JSONValue) => void;
}

export interface AppData {
  appId: number;
  appName: string;
  rating: number;
  ratingCount: number;
  iconUrl?: string;
}

// ----------------------------------------------------------------------
// Analysis Configuration and Options
// ----------------------------------------------------------------------

export interface AnalysisOptions {
  competitors: string[];
  yourAppId: string;
  reviewCount?: number;
  outputDir?: string;
  analysisDepth?: "basic" | "detailed" | "comprehensive";
  includePricing?: boolean;
  targetUserSegment?: string;
}

// ----------------------------------------------------------------------
// Sentiment and Review Types
// ----------------------------------------------------------------------

export type SentimentComparisonItem = {
  overall: number;
  positive: number;
  neutral: number;
  negative: number;
  trend: "improving" | "stable" | "declining" | "unknown";
};

export interface ReviewData {
  id: string;
  appName: string;
  userName: string;
  date: string;
  score: number;
  text: string;
  featureMentions?: string[];
  pricingMentions?: boolean;
}

// ----------------------------------------------------------------------
// Feature Comparison Types
// ----------------------------------------------------------------------

export interface FeatureData {
  scores: number[];
  mentions: number[];
  apps: string[];
}

export interface FeatureComparisonItem {
  feature: string;
  appCoverage: number;
  averageSentiment: number;
  totalMentions: number;
  presentInApps: string[];
  appMentions?: Record<string, number>;
}

// ----------------------------------------------------------------------
// Strengths and Weaknesses Types
// ----------------------------------------------------------------------

export interface StrengthItem {
  strength: string;
  apps: string[];
}

export interface WeaknessItem {
  weakness: string;
  apps: string[];
}

export interface StrengthsResult {
  common: { strength: string; apps: string[] }[];
  unique: { strength: string; app: string }[];
}

export interface WeaknessesResult {
  common: { weakness: string; apps: string[] }[];
  unique: { weakness: string; app: string }[];
}

// ----------------------------------------------------------------------
// Pricing Types
// ----------------------------------------------------------------------

export interface PricingComparisonItem {
  appName: string;
  valueForMoney: number;
  pricingComplaints: number;
  willingness: string;
  reviewIds: number[];
}

// ----------------------------------------------------------------------
// Analysis Results Data Types
// ----------------------------------------------------------------------

export interface AnalysisResultsData {
  type: "analysis_results";
  appId: number;
  appName: string;
  strengths: {
    description: string;
    title: string;
    reviewIds: number[];
  }[];
  weaknesses: {
    description: string;
    title: string;
    reviewIds: number[];
  }[];
  opportunities: {
    title: string;
    description: string;
    reviewIds: number[];
  }[];
  marketPosition: string;
  targetDemographic: string;
  threats: {
    title: string;
    description: string;
    reviewIds: number[];
  }[];
  keyFeatures: {
    feature: string;
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    description: string;
    reviewIds: number[];
  }[];
  pricing: {
    valueForMoney: string;
    pricingComplaints: number;
    willingness: string;
    reviewIds: number[];
  };
  recommendations: {
    action: string;
    priority: string;
    impact: string;
  }[];
  reviewMappings?: {
    strengthsReviewMap?: Record<string, string[] | number[]>;
    weaknessesReviewMap?: Record<string, string[] | number[]>;
    sentimentReviewMap?: Record<string, string[] | number[]>;
    featuresReviewMap?: Record<string, string[] | number[]>;
  };
}

export interface AppAnalysisResult {
  appInfo: App;
  analysis: AppAnalysis;
  analysisResults: AnalysisResultsData;
}

export interface ComparisonData {
  type: "comparison_results";
  apps: {
    appName: string;
    appId: number;
    rating: string;
    ratingCount: number;
  }[];
  featureComparison: FeatureComparisonItem[];
  marketPositionComparison: { appName: string; marketPosition: string }[];
  pricingComparison: PricingComparisonItem[];
  userBaseComparison: { appName: string; demographics: string }[];
  recommendationSummary: string[];
  reviews: {
    feature: Record<string, Record<string, number[]>>;
    pricing: Record<string, number[]>;
  };
}

export interface ComparisonResultsData {
  apps: AppData[];
  featureComparison: FeatureComparisonItem[];
  pricingComparison: PricingComparisonItem[];
  marketPositionComparison: { appName: string; marketPosition: string }[];
  userBaseComparison: { appName: string; demographics: string }[];
  recommendationSummary: string[];
}

// ----------------------------------------------------------------------
// Zod Schema Types
// ----------------------------------------------------------------------

// Use schema-inferred type for consistency
export type AppAnalysis = AppAnalysisSchema;

// Action plan and recommendation schemas
export const actionStepSchema = z.object({
  step: z.number().min(1).max(7),
  title: z.string().describe("A concise, action-oriented title for this step"),
  description: z
    .string()
    .describe(
      "A detailed explanation of what to do and why this step is important",
    ),
  priorityLevel: z
    .enum(["Critical", "High", "Medium", "Low"])
    .describe("The priority level of this action step"),
});

export const recommendationSchema = z.object({
  actionPlan: z
    .array(actionStepSchema)
    .describe(
      "A comprehensive, step-by-step action plan for creating a superior app",
    ),
});
