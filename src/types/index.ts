import { z } from "zod";
import type * as Gplay from "google-play-scraper";
import type { App } from "@prisma/client";

// Import schemas from their source files
import { type sentimentSchema } from "./sentiment-schema";
import { type reviewInsightSchema } from "./review-schema";
import { type competitorAnalysisSchema } from "@/app/api/chat/analysisSchemas";

// Import App Store types
import type {
  AppStoreAppInfo as ImportedAppStoreAppInfo,
  AppStoreReview as ImportedAppStoreReview,
} from "@/server/review-analyzer/services/appStoreDataFetcher";

// Schema-based types
export type ReviewInsight = z.infer<typeof reviewInsightSchema>;
export type SentimentType = z.infer<typeof sentimentSchema>;
export type CompetitorAnalysis = z.infer<typeof competitorAnalysisSchema>;

// ----------------------------------------------------------------------
// Google Play Scraper Types (External Types)
// ----------------------------------------------------------------------

export type Review = Gplay.IReviewsItem;
export type AppInfo = Gplay.IAppItemFullDetail;

// ----------------------------------------------------------------------
// App Store Types
// ----------------------------------------------------------------------

export type AppStoreReview = ImportedAppStoreReview;
export type AppStoreAppInfo = ImportedAppStoreAppInfo;

// ----------------------------------------------------------------------
// Platform-agnostic types
// ----------------------------------------------------------------------

export type Platform = "GOOGLE_PLAY" | "APP_STORE";

// Unified app info type that works for both stores
export interface UnifiedAppInfo {
  id: string | number;
  name: string;
  icon: string;
  developer: string;
  categories: Array<{ name: string; id: string | null }>;
  description: string;
  score?: number;
  ratings?: number;
  reviews?: number;
  histogram?: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  installs?: string;
  version?: string;
  platform: Platform;
  rawData: unknown;
}

// Unified review type that works for both stores
export interface UnifiedReview {
  id: string;
  userName: string;
  userImage?: string;
  date: string;
  score: number;
  title?: string;
  text: string;
  thumbsUp?: number;
  version?: string;
  platform: Platform;
  rawData: unknown;
}

// ----------------------------------------------------------------------
// Core App and Data Stream Types
// ----------------------------------------------------------------------

export interface DataStream {
  writeData: (data: string) => void;
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
  apps: Array<{
    appId: string;
    name: string;
    hasFeature: boolean;
    sentiment: "positive" | "negative" | "neutral";
    frequency: number;
    examples: string[];
  }>;
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
  appId: string;
  name: string;
  valuePerception: "high" | "medium" | "low";
  complaints: string[];
  advantages: string[];
}

// ----------------------------------------------------------------------
// Analysis Results Data Types
// ----------------------------------------------------------------------

export interface AnalysisResultsData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  marketPosition: string;
  targetDemographic: string;
  threats: string[];
  keyFeatures: Array<{
    name: string;
    frequency: number;
    sentiment: "positive" | "negative" | "neutral";
    examples: string[];
  }>;
  pricing: {
    valueForMoney: "high" | "medium" | "low";
    complaints: string[];
    willingness: "high" | "medium" | "low";
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: "feature" | "ux" | "performance" | "marketing" | "pricing";
  }>;
}

export interface AppAnalysisResult {
  appInfo: App;
  analysis: AnalysisResultsData;
}

export interface ComparisonData {
  featureComparison: FeatureComparisonItem[];
  marketPositionComparison: MarketPositionComparisonItem[];
  pricingComparison: PricingComparisonItem[];
  userBaseComparison: UserBaseComparisonItem[];
  recommendationSummary: RecommendationSummaryItem[];
  reviews: ReviewsComparisonItem[];
}

export interface MarketPositionComparisonItem {
  appId: string;
  name: string;
  position: string;
  strengths: string[];
  weaknesses: string[];
}

export interface UserBaseComparisonItem {
  appId: string;
  name: string;
  demographics: string;
  userTypes: string[];
  satisfaction: "high" | "medium" | "low";
}

export interface RecommendationSummaryItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "feature" | "ux" | "performance" | "marketing" | "pricing";
  targetApps: string[];
}

export interface ReviewsComparisonItem {
  appId: string;
  name: string;
  totalReviews: number;
  averageRating: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topKeywords: Array<{
    keyword: string;
    frequency: number;
    sentiment: "positive" | "negative" | "neutral";
  }>;
}

// ----------------------------------------------------------------------
// Zod Schema Types
// ----------------------------------------------------------------------

// Define a more complete AppAnalysis type to match the schema
export interface AppAnalysis {
  appName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  marketPosition: string;
  targetDemographic: string;
  threats: string[];
  keyFeatures: Array<{
    name: string;
    frequency: number;
    sentiment: "positive" | "negative" | "neutral";
    examples: string[];
  }>;
  pricing: {
    valueForMoney: "high" | "medium" | "low";
    complaints: string[];
    willingness: "high" | "medium" | "low";
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: "feature" | "ux" | "performance" | "marketing" | "pricing";
  }>;
}

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
