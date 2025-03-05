export interface AnalysisResultsData {
  appName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  topFeatures: {
    feature: string;
    sentiment: string;
    mentions: number;
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
