import gplay from "google-play-scraper";
import type * as Gplay from "google-play-scraper";
import { AppInfo, Review } from "../types";

const googlePlayScraper = gplay as unknown as Gplay.IMemoizedResult;

/**
 * Fetches app details and reviews for analysis
 * @param appId - The Google Play app ID to fetch data for
 * @param reviewCount - The number of reviews to fetch (default: 100)
 * @returns Promise resolving to AppInfo object with app details and reviews
 */
export async function fetchAppData(
  appId: string,
  reviewCount = 100,
): Promise<{
  appInfo: AppInfo;
  reviews: Review[];
}> {
  try {
    console.log(`Fetching data for app: ${appId}`);

    // Get app details
    const appDetails = await googlePlayScraper.app({ appId });

    // Get reviews
    const reviewsResult = await googlePlayScraper.reviews({
      appId,
      num: reviewCount,
      sort: googlePlayScraper.sort.NEWEST,
    });

    // Get historical reviews (if available) to analyze trends
    let olderReviews: typeof reviewsResult.data = [];
    try {
      const olderReviewsResult = await googlePlayScraper.reviews({
        appId,
        num: Math.min(50, reviewCount / 2),
        sort: googlePlayScraper.sort.HELPFULNESS,
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
      appInfo: appDetails,
      reviews: combinedReviews,
    };
  } catch (error) {
    console.error(`Error fetching data for ${appId}:`, error);
    throw error;
  }
}
