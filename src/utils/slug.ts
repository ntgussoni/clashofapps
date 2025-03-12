import { customAlphabet } from "nanoid";
import slugify from "slugify";

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
 * Extract app IDs from various link formats
 * @param links - Array of links or app IDs
 */
export function extractAppIds(links: string[]): string[] {
  return links.map((link) => {
    // Clean the input link by trimming whitespace
    const cleanLink = link.trim();

    // If it doesn't contain a slash or https, assume it's already an app ID
    if (!cleanLink.includes("/") && !cleanLink.includes("https")) {
      return cleanLink;
    }

    // Handle Google Play Store URLs manually if URL parsing fails
    if (cleanLink.includes("play.google.com") && cleanLink.includes("id=")) {
      const regex = /[?&]id=([^&]+)/;
      const idMatch = regex.exec(cleanLink);
      if (idMatch?.[1]) {
        return idMatch[1];
      }
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
        if (appId) return appId;
      }

      // Add more store-specific extraction logic as needed

      // If we couldn't extract an ID, return the original link
      return cleanLink;
    } catch {
      // If URL parsing fails, return the original link
      return cleanLink;
    }
  });
}
