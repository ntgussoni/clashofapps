import gplay from "google-play-scraper";
import type * as Gplay from "google-play-scraper";
import { AppInfo } from "../types";

/**
 * Fetches app details and reviews for analysis
 * @param appId - The Google Play app ID to fetch data for
 * @param reviewCount - The number of reviews to fetch (default: 100)
 * @returns Promise resolving to AppInfo object with app details and reviews
 */
export async function fetchAppData(
  appId: string,
  reviewCount: number = 100
): Promise<AppInfo> {
  try {
    console.log(`Fetching data for app: ${appId}`);

    // Get app details
    const appDetails = await (gplay as Gplay.IMemoizedResult).app({ appId });

    // Get reviews
    const reviewsResult = await gplay.reviews({
      appId,
      num: reviewCount,
      sort: gplay.sort.NEWEST,
    });

    // Get historical reviews (if available) to analyze trends
    let olderReviews: typeof reviewsResult.data = [];
    try {
      const olderReviewsResult = await gplay.reviews({
        appId,
        num: Math.min(50, reviewCount / 2),
        sort: gplay.sort.HELPFULNESS,
      });
      olderReviews = olderReviewsResult.data;
    } catch (_) {
      console.warn(`Could not fetch historical reviews for ${appId}`);
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
      appId,
      appName: appDetails.title,
      appIcon: appDetails.icon,
      reviews: combinedReviews,
      categories: Array.isArray(appDetails.genre)
        ? appDetails.genre
        : [appDetails.genre],
      appDescription: appDetails.summary || appDetails.description || "",
      appScore: appDetails.score || 0,
      installs: appDetails.installs || "Unknown",
      version: appDetails.version || "Unknown",
      updated: new Date(appDetails.updated || Date.now()),
    };
  } catch (error) {
    console.error(`Error fetching data for ${appId}:`, error);
    throw error;
  }
}
