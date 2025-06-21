import type { AppAnalysis } from "@/types";

// Import Prisma types - using a more specific import to avoid module resolution issues
interface App {
  id: number;
  appStoreId: string;
  name: string;
  icon: string;
  developer: string;
  categories: any;
  description: string;
  score?: number | null;
  ratings?: number | null;
  reviews?: number | null;
  histogram?: any;
  installs?: string | null;
  version?: string | null;
  rawData: any;
  lastFetched: Date;
  updatedAt: Date;
  appAnalysisDataId?: number | null;
}

interface AppReview {
  id: number;
  reviewId: string;
  userName: string;
  userImage?: string | null;
  date: string;
  score: number;
  title?: string | null;
  text: string;
  thumbsUp?: number | null;
  version?: string | null;
  rawData: any;
  appId: number;
  createdAt: Date;
}

// Types for App Store data - similar structure to Google Play but adapted for App Store API
export interface AppStoreAppInfo {
  appId: string;
  bundleId: string;
  name: string;
  icon: string;
  developer: string;
  categories: Array<{ name: string; id: string | null }>;
  description: string;
  score?: number;
  ratings?: number;
  reviews?: number;
  histogram?: { "1": number; "2": number; "3": number; "4": number; "5": number };
  installs?: string;
  version?: string;
  price?: string;
  currency?: string;
  free?: boolean;
  // Raw data
  rawData: Record<string, unknown>;
}

export interface AppStoreReview {
  id: string;
  userName: string;
  userImage?: string;
  date: string;
  score: number;
  title?: string;
  text: string;
  thumbsUp?: number;
  version?: string;
  // Raw data
  rawData: Record<string, unknown>;
}

export interface AppStoreDataResult {
  appInfo: AppStoreAppInfo;
  reviews: AppStoreReview[];
}

/**
 * Platform identifier for data fetching
 */
export enum Platform {
  GOOGLE_PLAY = "google_play",
  APP_STORE = "app_store",
}

/**
 * Detects the platform based on the app store ID format
 * @param appStoreId - The app store identifier
 * @returns The detected platform
 */
export function detectPlatform(appStoreId: string): Platform {
  // Google Play package names typically contain dots (com.example.app)
  // App Store IDs are typically numeric (1234567890) or bundle IDs
  if (appStoreId.includes(".") && !appStoreId.startsWith("id")) {
    return Platform.GOOGLE_PLAY;
  }
  
  // App Store numeric IDs or bundle IDs with "id" prefix
  if (/^\d+$/.test(appStoreId) || appStoreId.startsWith("id")) {
    return Platform.APP_STORE;
  }
  
  // Default to Google Play for now (maintaining backward compatibility)
  return Platform.GOOGLE_PLAY;
}

/**
 * Normalize App Store data to match the expected App model structure
 * @param appStoreData - Raw app store data
 * @returns Normalized app data compatible with existing system
 */
export function normalizeAppStoreData(appStoreData: AppStoreAppInfo): Partial<App> {
  return {
    appStoreId: appStoreData.appId,
    name: appStoreData.name,
    icon: appStoreData.icon,
    developer: appStoreData.developer,
    categories: appStoreData.categories,
    description: appStoreData.description,
    score: appStoreData.score,
    ratings: appStoreData.ratings,
    reviews: appStoreData.reviews,
    histogram: appStoreData.histogram,
    installs: appStoreData.installs,
    version: appStoreData.version,
    rawData: {
      ...appStoreData.rawData,
      platform: Platform.APP_STORE,
      price: appStoreData.price,
      currency: appStoreData.currency,
      free: appStoreData.free,
    },
  };
}

/**
 * Normalize App Store reviews to match the expected AppReview model structure
 * @param reviews - Raw app store reviews
 * @returns Normalized review data compatible with existing system
 */
export function normalizeAppStoreReviews(reviews: AppStoreReview[]): Partial<AppReview>[] {
  return reviews.map((review) => ({
    reviewId: review.id,
    userName: review.userName,
    userImage: review.userImage,
    date: review.date,
    score: review.score,
    title: review.title,
    text: review.text,
    thumbsUp: review.thumbsUp,
    version: review.version,
    rawData: {
      ...review.rawData,
      platform: Platform.APP_STORE,
    },
  }));
}

/**
 * Fetch App Store app data and reviews
 * Note: This is a placeholder implementation. In production, you would:
 * 1. Use the official App Store Connect API (requires Apple Developer account)
 * 2. Use third-party services like AppTweak, SensorTower, or App Annie
 * 3. Implement web scraping (be careful of rate limits and ToS)
 * 
 * @param appStoreId - App Store app ID (numeric or bundle ID)
 * @param options - Fetch options
 * @returns App store data and reviews
 */
export async function fetchAppStoreData(
  appStoreId: string,
  options: {
    reviewCount?: number;
    country?: string;
  } = {}
): Promise<AppStoreDataResult> {
  const reviewCount = options.reviewCount ?? 100;
  const country = options.country ?? "us";

  try {
    console.log(`Fetching App Store data for: ${appStoreId}`);
    
    // TODO: Implement actual App Store data fetching
    // For now, return mock data to demonstrate the structure
    
    // This is where you would implement one of the following:
    // 1. App Store Connect API integration
    // 2. Third-party service integration (AppTweak, SensorTower, etc.)
    // 3. iTunes Search API for basic app info + review scraping
    
    // Mock data for demonstration
    const mockAppInfo: AppStoreAppInfo = {
      appId: appStoreId,
      bundleId: `com.example.${appStoreId}`,
      name: `App Store App ${appStoreId}`,
      icon: "https://via.placeholder.com/512x512",
      developer: "Example Developer",
      categories: [{ name: "Productivity", id: "productivity" }],
      description: "This is a placeholder description for the App Store app. In production, this would contain the actual app description from the App Store.",
      score: 4.2,
      ratings: 1250,
      reviews: 320,
      histogram: { "1": 15, "2": 30, "3": 85, "4": 420, "5": 700 },
      installs: "10K+",
      version: "2.1.0",
      price: "$2.99",
      currency: "USD",
      free: false,
      rawData: {
        platform: Platform.APP_STORE,
        country,
        fetchedAt: new Date().toISOString(),
      },
    };

    const mockReviews: AppStoreReview[] = Array.from({ length: Math.min(reviewCount, 50) }, (_, i) => ({
      id: `appstore_review_${i + 1}`,
      userName: `AppStore User ${i + 1}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      score: Math.floor(Math.random() * 5) + 1,
      title: `Review Title ${i + 1}`,
      text: `This is a sample review text for the App Store app. Review number ${i + 1}. The app has various features that users appreciate.`,
      version: "2.1.0",
      rawData: {
        platform: Platform.APP_STORE,
        country,
        fetchedAt: new Date().toISOString(),
      },
    }));

    console.log(`Successfully fetched App Store data for ${appStoreId}: ${mockReviews.length} reviews`);

    return {
      appInfo: mockAppInfo,
      reviews: mockReviews,
    };

  } catch (error) {
    console.error(`Error fetching App Store data for ${appStoreId}:`, error);
    throw new Error(
      `Failed to fetch App Store data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get iTunes Search API data for basic app information
 * This is a free API that provides basic app information
 * @param appStoreId - App Store app ID
 * @param country - Country code
 * @returns Basic app information from iTunes Search API
 */
export async function getITunesAppInfo(
  appStoreId: string, 
  country: string = "us"
): Promise<any> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${appStoreId}&country=${country}`
    );
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("App not found in iTunes Search API");
    }
    
    return data.results[0];
  } catch (error) {
    console.error(`Error fetching iTunes data for ${appStoreId}:`, error);
    throw error;
  }
}

/**
 * Convert iTunes Search API data to our normalized format
 * @param itunesData - Data from iTunes Search API
 * @returns Normalized app data
 */
export function convertITunesDataToAppStoreInfo(itunesData: any): AppStoreAppInfo {
  return {
    appId: itunesData.trackId?.toString() || itunesData.bundleId,
    bundleId: itunesData.bundleId,
    name: itunesData.trackName,
    icon: itunesData.artworkUrl512 || itunesData.artworkUrl100,
    developer: itunesData.artistName,
    categories: [
      { 
        name: itunesData.primaryGenreName, 
        id: itunesData.primaryGenreId?.toString() 
      }
    ],
    description: itunesData.description || "",
    score: itunesData.averageUserRating,
    ratings: itunesData.userRatingCount,
    version: itunesData.version,
    price: itunesData.formattedPrice,
    currency: itunesData.currency,
    free: itunesData.price === 0,
    rawData: itunesData,
  };
}