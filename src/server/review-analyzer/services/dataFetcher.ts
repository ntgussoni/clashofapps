// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import gplay from "google-play-scraper";
import type * as Gplay from "google-play-scraper";
import { type AppInfo, type Review } from "@/types";
import type { AppReview } from "@prisma/client";
import { 
  detectPlatform, 
  Platform, 
  fetchAppStoreData,
  normalizeAppStoreData,
  normalizeAppStoreReviews 
} from "./appStoreDataFetcher";

const googlePlayScraper = gplay as unknown as Gplay.IMemoizedResult;

/**
 * Fetches app details and reviews for analysis from Google Play or App Store
 * @param appStoreId - The app store ID (Google Play package name or App Store numeric ID)
 * @param reviewCount - The number of reviews to fetch (default: 50)
 * @returns Promise resolving to AppInfo object with app details and reviews
 */
export async function fetchAppData(
  appStoreId: string,
  reviewCount = 50,
): Promise<{
  appInfo: AppInfo;
  reviews: Review[];
}> {
  const platform = detectPlatform(appStoreId);
  
  try {
    console.log(`Fetching data for app: ${appStoreId} (Platform: ${platform})`);

    if (platform === Platform.APP_STORE) {
      return await fetchAppStoreDataUnified(appStoreId, { reviewCount });
    } else {
      return await fetchGooglePlayData(appStoreId, reviewCount);
    }
  } catch (error) {
    console.error(`Error fetching data for ${appStoreId}:`, error);
    throw error;
  }
}

/**
 * Fetches app details and reviews specifically from Google Play
 * @param appStoreId - The Google Play package name
 * @param reviewCount - The number of reviews to fetch
 * @returns Promise resolving to AppInfo object with app details and reviews
 */
async function fetchGooglePlayData(
  appStoreId: string,
  reviewCount: number,
): Promise<{
  appInfo: AppInfo;
  reviews: Review[];
}> {
  // Get app details
  const appDetails = await googlePlayScraper.app({
    appId: appStoreId,
  });

  // Add platform information to raw data
  const appInfo = {
    ...appDetails,
    rawData: {
      ...appDetails,
      platform: "google_play",
    }
  } as AppInfo;

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
    appInfo,
    reviews: combinedReviews,
  };
}

/**
 * Fetches app information and reviews from App Store and normalizes to Google Play format
 * @param appStoreId - The App Store app ID
 * @param options - Configuration options for data fetching
 * @returns Object containing normalized app information and reviews
 */
async function fetchAppStoreDataUnified(
  appStoreId: string,
  options: {
    reviewCount?: number;
    country?: string;
  } = {},
) {
  console.log(`Fetching App Store data for: ${appStoreId}`);

  // Fetch App Store data
  const appStoreResult = await fetchAppStoreData(appStoreId, options);
  
  // Normalize App Store data to match Google Play format
  const normalizedAppInfo = normalizeAppStoreData(appStoreResult.appInfo);
  const normalizedReviews = normalizeAppStoreReviews(appStoreResult.reviews);

  // Convert to the expected format
  const appInfo = {
    ...normalizedAppInfo,
    appId: appStoreId, // Ensure appId is set for compatibility
    rawData: {
      ...normalizedAppInfo.rawData,
      platform: "app_store",
    }
  } as AppInfo;

  const reviews = normalizedReviews.map((review: Partial<AppReview>, index) => ({
    id: review.reviewId || `review_${index}`,
    userName: review.userName || 'Anonymous',
    userImage: review.userImage,
    date: review.date || new Date().toISOString(),
    score: review.score || 3,
    scoreText: review.score?.toString() || '3',
    url: '',
    title: review.title,
    text: review.text || '',
    thumbsUp: review.thumbsUp || 0,
    version: review.version,
    // Add any additional fields that might be expected
    at: new Date(review.date || new Date()).getTime(),
  })) as Review[];

  console.log(
    `Successfully fetched and normalized App Store data for ${appStoreId}: ${reviews.length} reviews`,
  );

  return {
    appInfo,
    reviews,
  };
}
