import { customAlphabet } from "nanoid";
import slugify from "slugify";
import { type Platform } from "@/types";

// Create a custom nanoid with a more URL-friendly alphabet (excluding ambiguous characters)
const nanoid = customAlphabet("abcdefghijkmnopqrstuvwxyz0123456789", 6);

/**
 * Generate a unique slug for an analysis based on app IDs
 * @param appIds - List of app IDs to include in the slug
 */
export function generateAnalysisSlug(appStoreIds: string[]): string {
  // Default base slug if we can't extract from app IDs
  const baseSlug = slugify(appStoreIds.join("-"), {
    lower: true,
    replacement: "-",
    trim: true,
  });

  // Generate a random suffix
  const randomSuffix = nanoid();

  // Combine them
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Generates a URL-safe slug from a given string
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Extract app IDs from various link formats supporting both Google Play and App Store
 * @param links - Array of links or app IDs
 */
export function extractAppIds(links: string[]): Array<{ appId: string; platform: Platform }> {
  return links.map((link) => {
    // Clean the input link by trimming whitespace
    const cleanLink = link.trim();

    // If it doesn't contain a slash or https, assume it's already an app ID
    if (!cleanLink.includes("/") && !cleanLink.includes("https")) {
      // Try to detect platform from the app ID format
      const platform = detectPlatformFromId(cleanLink);
      return { appId: cleanLink, platform };
    }

    try {
      const url = new URL(cleanLink);

      // Handle Google Play Store URLs
      if (
        url.hostname === "play.google.com" ||
        url.host.endsWith("play.google.com")
      ) {
        const params = new URLSearchParams(url.search);
        const appId = params.get("id");
        if (appId) return { appId, platform: "GOOGLE_PLAY" };
      }

      // Handle App Store URLs
      if (
        url.hostname === "apps.apple.com" ||
        url.hostname === "itunes.apple.com" ||
        url.host.endsWith("apps.apple.com") ||
        url.host.endsWith("itunes.apple.com")
      ) {
        // App Store URLs can be in several formats:
        // https://apps.apple.com/us/app/candy-crush-saga/id553834731
        // https://itunes.apple.com/us/app/candy-crush-saga/id553834731?mt=8
        const pathParts = url.pathname.split("/");
        
        // Look for the id parameter in query string first
        const params = new URLSearchParams(url.search);
        const queryId = params.get("id");
        if (queryId) {
          return { appId: queryId, platform: "APP_STORE" };
        }

        // Look for id in the path
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (part && part.startsWith("id") && part.length > 2) {
            const appId = part.substring(2); // Remove "id" prefix
            if (/^\d+$/.test(appId)) {
              return { appId, platform: "APP_STORE" };
            }
          }
        }
      }

      // If we couldn't extract an ID, return the original link with detected platform
      const platform = detectPlatformFromUrl(url);
      return { appId: cleanLink, platform };
    } catch {
      // If URL parsing fails, try to detect platform and return the original link
      const platform = detectPlatformFromId(cleanLink);
      return { appId: cleanLink, platform };
    }
  });
}

/**
 * Extract a single app ID from URL or string
 * @param input - URL or app ID string
 * @returns Object with appId and platform
 */
export function extractAppId(input: string): { appId: string; platform: Platform } {
  const results = extractAppIds([input]);
  return results[0] || { appId: input, platform: "GOOGLE_PLAY" };
}

/**
 * Detect platform from app ID format
 * @param appId - The app ID to analyze
 * @returns The detected platform
 */
function detectPlatformFromId(appId: string): Platform {
  // App Store IDs are numeric
  if (/^\d+$/.test(appId)) {
    return "APP_STORE";
  }
  
  // Google Play IDs are typically reverse domain notation
  if (/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/i.test(appId)) {
    return "GOOGLE_PLAY";
  }

  // Default to Google Play if we can't determine
  return "GOOGLE_PLAY";
}

/**
 * Detect platform from URL
 * @param url - The URL object to analyze
 * @returns The detected platform
 */
function detectPlatformFromUrl(url: URL): Platform {
  const hostname = url.hostname.toLowerCase();
  
  if (hostname.includes("play.google.com")) {
    return "GOOGLE_PLAY";
  }
  
  if (hostname.includes("apps.apple.com") || hostname.includes("itunes.apple.com")) {
    return "APP_STORE";
  }

  // Default to Google Play
  return "GOOGLE_PLAY";
}

/**
 * Legacy function for backward compatibility - extracts Google Play app IDs only
 * @param links - Array of links or app IDs
 * @returns Array of Google Play app IDs
 */
export function extractGooglePlayAppIds(links: string[]): string[] {
  return extractAppIds(links)
    .filter(({ platform }) => platform === "GOOGLE_PLAY")
    .map(({ appId }) => appId);
}

/**
 * Extract App Store app IDs only
 * @param links - Array of links or app IDs
 * @returns Array of App Store app IDs
 */
export function extractAppStoreAppIds(links: string[]): string[] {
  return extractAppIds(links)
    .filter(({ platform }) => platform === "APP_STORE")
    .map(({ appId }) => appId);
}

/**
 * Check if an ID or URL is for Google Play
 * @param input - App ID or URL
 * @returns True if it's a Google Play app
 */
export function isGooglePlay(input: string): boolean {
  return extractAppId(input).platform === "GOOGLE_PLAY";
}

/**
 * Check if an ID or URL is for App Store
 * @param input - App ID or URL
 * @returns True if it's an App Store app
 */
export function isAppStore(input: string): boolean {
  return extractAppId(input).platform === "APP_STORE";
}
