import type { AppAnalysis } from "@/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as appStore from "app-store-scraper";

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
  // App Store numeric IDs (e.g., "553834731") or bundle IDs with "id" prefix
  if (/^\d+$/.test(appStoreId) || appStoreId.startsWith("id")) {
    return Platform.APP_STORE;
  }
  
  // Bundle IDs that don't contain dots are likely App Store (e.g., "com.facebook.Facebook")
  // But if they do contain dots, they're typically Google Play package names
  if (appStoreId.includes(".")) {
    // Check if it's a reverse domain notation (typical for both platforms)
    // For now, assume Google Play for dotted package names unless specified otherwise
    return Platform.GOOGLE_PLAY;
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
 * Fetch App Store app data and reviews using the app-store-scraper library
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
    
    // Fetch app information using app-store-scraper
    const appInfo = await appStore.app({
      id: appStoreId,
      country: country,
    });

    // Fetch reviews using app-store-scraper
    let allReviews: any[] = [];
    const reviewPages = Math.ceil(Math.min(reviewCount, 500) / 50); // Max 50 reviews per page, limit to 500 total
    
    for (let page = 1; page <= Math.min(reviewPages, 10); page++) {
      try {
        const reviewsResult = await appStore.reviews({
          id: appStoreId,
          country: country,
          page: page,
          sort: appStore.sort.RECENT,
        });
        
        allReviews = allReviews.concat(reviewsResult);
        
        if (reviewsResult.length < 50) {
          // Less than full page, probably no more reviews
          break;
        }
        
        if (allReviews.length >= reviewCount) {
          break;
        }
        
        // Add a small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (reviewError) {
        console.warn(`Could not fetch reviews page ${page} for ${appStoreId}:`, reviewError);
        if (page === 1) {
          // If first page fails, still continue with app info
          break;
        }
      }
    }

    // Convert to our normalized format
    const normalizedAppInfo: AppStoreAppInfo = {
      appId: appInfo.id?.toString() || appStoreId,
      bundleId: appInfo.bundleId || appInfo.appId || appStoreId,
      name: appInfo.title || appInfo.trackName || `App ${appStoreId}`,
      icon: appInfo.icon || appInfo.artworkUrl512 || appInfo.artworkUrl100 || "",
      developer: appInfo.developer || appInfo.artistName || "Unknown Developer",
      categories: appInfo.genres ? appInfo.genres.map((genre: string) => ({ name: genre, id: genre.toLowerCase() })) : [],
      description: appInfo.description || "",
      score: appInfo.score || appInfo.averageUserRating,
      ratings: appInfo.reviews || appInfo.userRatingCount,
      reviews: allReviews.length,
      histogram: appInfo.histogram,
      version: appInfo.version,
      price: appInfo.price || appInfo.formattedPrice,
      currency: appInfo.currency,
      free: appInfo.free || appInfo.price === 0,
      rawData: {
        ...appInfo,
        platform: Platform.APP_STORE,
        country,
        fetchedAt: new Date().toISOString(),
      },
    };

    // Convert reviews to our format
    const normalizedReviews: AppStoreReview[] = allReviews.slice(0, reviewCount).map((review, index) => ({
      id: review.id || `appstore_review_${index}`,
      userName: review.userName || review.title || "Anonymous",
      userImage: review.userImage,
      date: review.updated || review.date || new Date().toISOString(),
      score: review.score || 3,
      title: review.title,
      text: review.text || review.review || "",
      version: review.version,
      rawData: {
        ...review,
        platform: Platform.APP_STORE,
        country,
        fetchedAt: new Date().toISOString(),
      },
    }));

    console.log(`Successfully fetched App Store data for ${appStoreId}: ${normalizedReviews.length} reviews`);

    return {
      appInfo: normalizedAppInfo,
      reviews: normalizedReviews,
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