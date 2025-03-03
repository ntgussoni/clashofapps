import { z } from "zod";
import {
  type sentimentSchema,
  type reviewInsightSchema,
  type appAnalysisSchema,
  type competitorAnalysisSchema,
} from "./schemas";

/**
 * Core types for the review analyzer functionality
 */

// Type for review data from Google Play
export interface Review {
  id: string;
  userName: string;
  userImage: string;
  date: string;
  score: number;
  scoreText: string;
  title?: string;
  text: string;
  replyDate?: string;
  replyText?: string;
  version?: string;
  thumbsUp?: number;
  criterias?: Array<{
    criteria: string;
    rating: number;
  }>;
}

// App information structure containing data fetched from Google Play
export interface AppInfo {
  appId: string;
  appName: string;
  appIcon: string;
  reviews: Review[];
  categories: string[];
  appDescription: string;
  appScore: number;
  installs: string;
  version: string;
  updated: Date;
}

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
