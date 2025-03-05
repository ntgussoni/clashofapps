import { type z } from "zod";
import {
  type sentimentSchema,
  type reviewInsightSchema,
  type appAnalysisSchema,
  type competitorAnalysisSchema,
} from "./schemas";
import type * as Gplay from "google-play-scraper";

export type Review = Gplay.IReviewsItem;
export type AppInfo = Gplay.IAppItemFullDetail;

/**
 * Core types for the review analyzer functionality
 */

// Configuration options for the analysis process
export interface AnalysisOptions {
  competitors: string[];
  yourAppId: string;
  reviewCount?: number;
  outputDir?: string;
  analysisDepth?: "basic" | "detailed" | "comprehensive";
  includePricing?: boolean;
  targetUserSegment?: string;
}

// Type definitions derived from Zod schemas
export type SentimentType = z.infer<typeof sentimentSchema>;
export type ReviewInsightType = z.infer<typeof reviewInsightSchema>;
export type AppAnalysis = z.infer<typeof appAnalysisSchema>;
export type CompetitorAnalysis = z.infer<typeof competitorAnalysisSchema>;

// Helper type for sentiment comparison
export type SentimentComparisonItem = {
  overall: number;
  positive: number;
  neutral: number;
  negative: number;
  trend: "improving" | "stable" | "declining" | "unknown";
};
