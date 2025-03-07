export interface AnalysisResultsData {
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
  threats: string[];
  topFeatures: {
    description: string;
    title: string;
    reviewIds: number[];
  }[];
  marketPosition: string;
  targetDemographic: string;
  pricing: {
    valueForMoney: string;
    pricingComplaints: number;
    willingness: string;
  };
  recommendations: {
    action: string;
    priority: string;
    impact: string;
  }[];
  reviewMappings?: {
    strengthsReviewMap?: Record<string, string[]>;
    weaknessesReviewMap?: Record<string, string[]>;
    sentimentReviewMap?: Record<string, string[]>;
    featuresReviewMap?: Record<string, string[]>;
  };
}

export interface AppData {
  appId: string;
  appName: string;
  rating: number;
  ratingCount: number;
  iconUrl?: string;
}

export interface StrengthItem {
  strength: string;
  apps: string[];
}

export interface WeaknessItem {
  weakness: string;
  apps: string[];
}

export interface StrengthsComparison {
  common: StrengthItem[];
  unique: Record<string, string[]>;
}

export interface WeaknessesComparison {
  common: WeaknessItem[];
  unique: Record<string, string[]>;
}

export interface FeatureComparisonItem {
  feature: string;
  appCoverage: number;
  averageSentiment: number;
  totalMentions: number;
  appMentions: Record<string, number>;
}

export interface PricingComparisonItem {
  appName: string;
  valueForMoney: number;
  pricingComplaints: number;
  willingness: string;
}

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

export interface ComparisonResultsData {
  apps: AppData[];
  strengthsComparison: StrengthsComparison;
  weaknessesComparison: WeaknessesComparison;
  featureComparison: FeatureComparisonItem[];
  pricingComparison: PricingComparisonItem[];
  recommendationSummary: string[];
  reviews: {
    feature: Record<string, ReviewData[]>;
    pricing: Record<string, ReviewData[]>;
  };
}
