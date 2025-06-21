// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - app-store-scraper doesn't have TypeScript definitions
import store from "app-store-scraper";

// Define types for App Store scraper since no official types exist
interface AppStoreScraper {
  app: (options: { id: string; ratings?: boolean }) => Promise<AppStoreAppInfo>;
  reviews: (options: { id: string; page: number; sort: number }) => Promise<AppStoreReview[]>;
  search: (options: { term: string; num: number }) => Promise<AppStoreAppInfo[]>;
  developer: (options: { devId: number; num: number }) => Promise<AppStoreAppInfo[]>;
  similar: (options: { id: string }) => Promise<AppStoreAppInfo[]>;
  sort: {
    RECENT: number;
    HELPFUL: number;
  };
}

// Define types for App Store scraper
export interface AppStoreAppInfo {
  id: number;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: string[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite?: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
  histogram?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface AppStoreReview {
  id: string;
  userName: string;
  userUrl?: string;
  version: string;
  score: number;
  title: string;
  text: string;
  updated: string;
  url: string;
}

const appStoreScraper = store as unknown as AppStoreScraper;

/**
 * Fetches app details and reviews for analysis from App Store
 * @param appId - The App Store app ID (numeric ID) to fetch data for
 * @param reviewCount - The number of reviews to fetch (default: 100)
 * @returns Promise resolving to AppStoreAppInfo object with app details and reviews
 */
export async function fetchAppStoreData(
  appId: string,
  reviewCount = 50,
): Promise<{
  appInfo: AppStoreAppInfo;
  reviews: AppStoreReview[];
}> {
  try {
    console.log(`Fetching App Store data for app:${appId}`);

    // Get app details with ratings if available
    const appDetails = await appStoreScraper.app({
      id: appId,
      ratings: true, // Include ratings histogram
    });

    // Get reviews
    const reviewsResult = await appStoreScraper.reviews({
      id: appId,
      page: 1,
      sort: appStoreScraper.sort.RECENT,
    });

    // Try to get more reviews from different pages if needed
    let allReviews = [...reviewsResult];
    const maxPages = Math.min(5, Math.ceil(reviewCount / 50)); // App Store gives ~50 reviews per page

    for (let page = 2; page <= maxPages && allReviews.length < reviewCount; page++) {
      try {
        const moreReviews = await appStoreScraper.reviews({
          id: appId,
          page: page,
          sort: appStoreScraper.sort.RECENT,
        });
        allReviews = [...allReviews, ...moreReviews];
      } catch (error) {
        console.warn(`Could not fetch page ${page} reviews for ${appId}:`, error);
        break;
      }
    }

    // Also try to get some helpful reviews
    try {
      const helpfulReviews = await appStoreScraper.reviews({
        id: appId,
        page: 1,
        sort: appStoreScraper.sort.HELPFUL,
      });
      
      // Merge helpful reviews, avoiding duplicates
      const existingIds = new Set(allReviews.map((r) => r.id));
      helpfulReviews.forEach((review: AppStoreReview) => {
        if (!existingIds.has(review.id) && allReviews.length < reviewCount) {
          allReviews.push(review);
          existingIds.add(review.id);
        }
      });
    } catch (error) {
      console.warn(`Could not fetch helpful reviews for ${appId}:`, error);
    }

    // Limit to requested count
    const limitedReviews = allReviews.slice(0, reviewCount);

    return {
      appInfo: appDetails,
      reviews: limitedReviews,
    };
  } catch (error) {
    console.error(`Error fetching App Store data for ${appId}:`, error);
    throw error;
  }
}

/**
 * Search for apps in the App Store
 * @param term - Search term
 * @param num - Number of results to return
 * @returns Promise resolving to array of app search results
 */
export async function searchAppStore(
  term: string,
  num = 10,
): Promise<AppStoreAppInfo[]> {
  try {
    const results = await appStoreScraper.search({
      term,
      num,
    });
    return results;
  } catch (error) {
    console.error(`Error searching App Store for term "${term}":`, error);
    throw error;
  }
}

/**
 * Get apps by developer from the App Store
 * @param devId - Developer ID
 * @param num - Number of results to return
 * @returns Promise resolving to array of developer's apps
 */
export async function getAppsByDeveloper(
  devId: string,
  num = 20,
): Promise<AppStoreAppInfo[]> {
  try {
    const results = await appStoreScraper.developer({
      devId: parseInt(devId),
      num,
    });
    return results;
  } catch (error) {
    console.error(`Error fetching apps by developer ${devId}:`, error);
    throw error;
  }
}

/**
 * Get similar apps from the App Store
 * @param appId - App ID to find similar apps for
 * @returns Promise resolving to array of similar apps
 */
export async function getSimilarApps(appId: string): Promise<AppStoreAppInfo[]> {
  try {
    const results = await appStoreScraper.similar({
      id: appId,
    });
    return results;
  } catch (error) {
    console.error(`Error fetching similar apps for ${appId}:`, error);
    throw error;
  }
}