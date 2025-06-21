// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import gplay from "google-play-scraper";
import type * as Gplay from "google-play-scraper";
import {
  type AppInfo,
  type Review,
  type UnifiedAppInfo,
  type UnifiedReview,
  type Platform,
} from "@/types";
import {
  fetchAppStoreData,
  type AppStoreAppInfo,
  type AppStoreReview,
} from "./appStoreDataFetcher";

const googlePlayScraper = gplay as unknown as Gplay.IMemoizedResult;

/**
 * Normalize Google Play app data to unified format
 */
function normalizeGooglePlayApp(appInfo: AppInfo): UnifiedAppInfo {
  return {
    id: appInfo.appId,
    name: appInfo.title,
    icon: appInfo.icon,
    developer: appInfo.developer || "",
    categories: appInfo.categories as Array<{
      name: string;
      id: string | null;
    }>,
    description: appInfo.description,
    score: appInfo.score,
    ratings: appInfo.ratings,
    reviews: appInfo.reviews,
    histogram: appInfo.histogram,
    installs: appInfo.installs,
    version: appInfo.version,
    platform: "GOOGLE_PLAY",
    rawData: appInfo,
  };
}

/**
 * Normalize App Store app data to unified format
 */
function normalizeAppStoreApp(appInfo: AppStoreAppInfo): UnifiedAppInfo {
  return {
    id: appInfo.id,
    name: appInfo.title,
    icon: appInfo.icon,
    developer: appInfo.developer,
    categories: appInfo.genres.map((genre) => ({ name: genre, id: null })),
    description: appInfo.description,
    score: appInfo.score,
    ratings: appInfo.reviews,
    reviews: appInfo.reviews,
    histogram: appInfo.histogram,
    installs: undefined, // App Store doesn't provide install counts
    version: appInfo.version,
    platform: "APP_STORE",
    rawData: appInfo,
  };
}

/**
 * Normalize Google Play review data to unified format
 */
function normalizeGooglePlayReview(review: Review): UnifiedReview {
  return {
    id: review.id,
    userName: review.userName,
    userImage: review.userImage,
    date: review.date,
    score: review.score,
    title: review.title,
    text: review.text,
    thumbsUp: review.thumbsUp,
    version: review.version,
    platform: "GOOGLE_PLAY",
    rawData: review,
  };
}

/**
 * Normalize App Store review data to unified format
 */
function normalizeAppStoreReview(review: AppStoreReview): UnifiedReview {
  return {
    id: review.id,
    userName: review.userName,
    userImage: undefined, // App Store reviews don't include user images
    date: review.updated,
    score: review.score,
    title: review.title,
    text: review.text,
    thumbsUp: undefined, // App Store doesn't provide thumbs up counts
    version: review.version,
    platform: "APP_STORE",
    rawData: review,
  };
}

/**
 * Detect platform from app ID
 */
export function detectPlatform(appId: string): Platform {
  // Google Play app IDs are typically reverse domain notation (com.example.app)
  // App Store app IDs are numeric strings
  if (/^\d+$/.test(appId)) {
    return "APP_STORE";
  } else if (/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(appId)) {
    return "GOOGLE_PLAY";
  }

  // Default to Google Play if we can't determine
  return "GOOGLE_PLAY";
}

/**
 * Fetches app details and reviews for analysis from Google Play
 * @param appStoreId - The Google Play app ID to fetch data for
 * @param reviewCount - The number of reviews to fetch (default: 100)
 * @returns Promise resolving to AppInfo object with app details and reviews
 */
async function fetchGooglePlayData(
  appStoreId: string,
  reviewCount = 50,
): Promise<{
  appInfo: AppInfo;
  reviews: Review[];
}> {
  try {
    console.log(`Fetching Google Play data for app:${appStoreId}`);

    // Get app details
    const appDetails = await googlePlayScraper.app({
      appId: appStoreId,
    });

    // Get reviews
    const reviewsResult = await googlePlayScraper.reviews({
      appId: appStoreId,
      lang: "",
      country: "",
      num: reviewCount,
      sort: 2,
    });

    // Get historical reviews (if available) to analyze trends
    let olderReviews: typeof reviewsResult.data = [];
    try {
      const olderReviewsResult = await googlePlayScraper.reviews({
        appId: appStoreId,
        lang: "",
        country: "",
        num: Math.min(50, reviewCount / 2),
        sort: 1, // HELPFULNESS
      });
      olderReviews = olderReviewsResult.data;
    } catch (error) {
      console.warn(
        `Could not fetch historical reviews for ${appStoreId}:`,
        error,
      );
    }

    // Combine reviews, ensuring no duplicates
    const combinedReviews = [...reviewsResult.data];
    const existingIds = new Set(combinedReviews.map((r) => r.id));

    olderReviews.forEach((review) => {
      if (!existingIds.has(review.id)) {
        combinedReviews.push(review);
        existingIds.add(review.id);
      }
    });

    return {
      appInfo: appDetails,
      reviews: combinedReviews,
    };
  } catch (error) {
    console.error(`Error fetching Google Play data for ${appStoreId}:`, error);
    throw error;
  }
}

/**
 * Unified function to fetch app data from either Google Play or App Store
 * @param appStoreId - The app ID to fetch data for
 * @param reviewCount - The number of reviews to fetch (default: 50)
 * @param platform - Optional platform override, otherwise auto-detected
 * @returns Promise resolving to unified app info and reviews
 */
export async function fetchAppData(
  appStoreId: string,
  reviewCount = 50,
  platform?: Platform,
): Promise<{
  appInfo: UnifiedAppInfo;
  reviews: UnifiedReview[];
}> {
  const detectedPlatform = platform || detectPlatform(appStoreId);

  if (detectedPlatform === "APP_STORE") {
    const { appInfo, reviews } = await fetchAppStoreData(
      appStoreId,
      reviewCount,
    );
    return {
      appInfo: normalizeAppStoreApp(appInfo),
      reviews: reviews.map(normalizeAppStoreReview),
    };
  } else {
    const { appInfo, reviews } = await fetchGooglePlayData(
      appStoreId,
      reviewCount,
    );
    return {
      appInfo: normalizeGooglePlayApp(appInfo),
      reviews: reviews.map(normalizeGooglePlayReview),
    };
  }
}

// Legacy function for backward compatibility
export async function fetchGooglePlayAppData(
  appStoreId: string,
  reviewCount = 50,
): Promise<{
  appInfo: AppInfo;
  reviews: Review[];
}> {
  return fetchGooglePlayData(appStoreId, reviewCount);
}
