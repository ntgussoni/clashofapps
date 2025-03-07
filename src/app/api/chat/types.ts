import type { JSONValue } from "ai";
import type { AppAnalysis } from "@/server/review-analyzer/types";
import type { App } from "@prisma/client";
import { z } from "zod";

// Define a type for our data stream
export interface DataStream {
  writeData: (data: JSONValue) => void;
}

// Define interfaces for our data structures
export interface AppAnalysisResult {
  appInfo: App;
  analysis: AppAnalysis;
  analysisResults: AnalysisResultsData;
}

export interface AnalysisResultsData {
  type: string;
  appId: string;
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
  opportunities: string[];
  marketPosition: string;
  targetDemographic: string;
  threats: string[];
  topFeatures: {
    description: string;
    title: string;
    reviewIds: number[];
  }[];
  pricing: {
    valueForMoney: string;
    pricingComplaints: string;
    willingness: string;
  };
  recommendations: {
    action: string;
    priority: string;
    impact: string;
  }[];
  reviewMappings?: {
    strengthsReviewMap?: Record<string, number[]>;
    weaknessesReviewMap?: Record<string, number[]>;
    sentimentReviewMap?: Record<string, number[]>;
    featuresReviewMap?: Record<string, number[]>;
  };
}

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
}

export interface ComparisonData {
  type: string;
  apps: {
    appName: string;
    appId: string;
    rating: string;
    ratingCount: number;
  }[];
  featureComparison: FeatureComparisonItem[];
  strengthsComparison: {
    common: { strength: string; apps: string[] }[];
    unique: { strength: string; app: string }[];
  };
  weaknessesComparison: {
    common: { weakness: string; apps: string[] }[];
    unique: { weakness: string; app: string }[];
  };
  marketPositionComparison: { appName: string; marketPosition: string }[];
  pricingComparison: {
    appName: string;
    valueForMoney: number;
    pricingComplaints: number;
    willingness: string;
  }[];
  userBaseComparison: { appName: string; demographics: string }[];
  recommendationSummary: string[];
}

// Type for the result of processMapEntries for strengths
export interface StrengthsResult {
  common: { strength: string; apps: string[] }[];
  unique: { strength: string; app: string }[];
}

// Type for the result of processMapEntries for weaknesses
export interface WeaknessesResult {
  common: { weakness: string; apps: string[] }[];
  unique: { weakness: string; app: string }[];
}

// Define schema for AI-generated recommendations
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
