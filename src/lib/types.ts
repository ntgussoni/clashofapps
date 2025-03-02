export interface AppType {
  id: string
  name: string
  icon: string
  developer: string
  category: string
  rating: number
  reviewCount: number
  downloads: number
  activeUsers: number
  lastUpdated: string
  keyFeatures: string[]
  reviewInsights: {
    sentiment: "positive" | "neutral" | "negative"
    text: string
  }[]
  keywords: {
    text: string
    weight: number
    sentiment: "positive" | "neutral" | "negative"
  }[]
  ratingTimeline: {
    month: string
    rating: number
  }[]
}

