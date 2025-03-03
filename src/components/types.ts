export interface AnalysisResultsData {
  appName: string;
  strengths: string[];
  weaknesses: string[];
  topFeatures: {
    feature: string;
    sentiment: string;
    mentions: number;
  }[];
  marketPosition: string;
  userDemographics: string;
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

export interface AppInfoData {
  appId: string;
  appName: string;
  icon: string;
  rating: number | string;
  reviewCount: number;
  installs: string;
  version: string;
  categories: string[];
}

export interface ComparisonResultsData {
  apps: {
    appId: string;
    appName: string;
    rating: number;
    ratingCount: number;
  }[];
  strengthsComparison: {
    common: {
      strength: string;
      apps: string[];
    }[];
  };
  weaknessesComparison: {
    common: {
      weakness: string;
      apps: string[];
    }[];
  };
  featureComparison: {
    feature: string;
    appCoverage: number;
    averageSentiment: number;
    totalMentions: number;
  }[];
  pricingComparison: {
    appName: string;
    valueForMoney: number;
    pricingComplaints: number;
    willingness: string;
  }[];
  recommendationSummary: string[];
}
