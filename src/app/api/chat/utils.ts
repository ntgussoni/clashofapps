import type { JSONValue } from "ai";
import type { DataStream } from "./types";

// Helper function to safely serialize data for the data stream
export function safeSerialize<T>(data: T): JSONValue {
  return JSON.parse(JSON.stringify(data)) as JSONValue;
}

// Helper function to send status updates
export function sendStatus(
  dataStream: DataStream,
  status: string,
  message: string,
): void {
  dataStream.writeData({
    type: "status",
    status,
    message,
  });
}

// Extract app IDs from input string
export function extractAppIds(input: string): string[] {
  // Split by commas or spaces if the input contains them
  if (
    input.includes(",") ||
    input.includes(" vs ") ||
    input.includes(" versus ")
  ) {
    const appIds: string[] = [];
    // Split by various delimiters
    const parts = input.split(/,|\s+vs\s+|\s+versus\s+/).map((p) => p.trim());

    for (const part of parts) {
      if (part) {
        appIds.push(extractAppId(part));
      }
    }

    return appIds;
  }

  // If there's only one app ID
  return [extractAppId(input)];
}

// Extract a single app ID from URL or string
export function extractAppId(input: string): string {
  // If it's already an app ID (no slashes or https), return it
  if (!input.includes("/") && !input.includes("https")) {
    return input;
  }

  // If it's a URL, extract the app ID
  try {
    const url = new URL(input);
    const pathParts = url.pathname.split("/");

    // Handle the case where the URL is from the Play Store
    if (url.hostname === "play.google.com") {
      // Format: https://play.google.com/store/apps/details?id=com.example.app
      const params = new URLSearchParams(url.search);
      const appId = params.get("id");
      if (appId) return appId;
    }

    // Try to find the app ID in the path (id might be after /id/ in the path)
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === "id" && i + 1 < pathParts.length) {
        const pathId = pathParts[i + 1];
        if (pathId) return pathId;
      }
    }
  } catch (e) {
    // If URL parsing fails, just return the input as-is
    console.error("Error parsing URL:", e);
  }

  return input; // Return the input as fallback
}

// Extract all app IDs from previous messages
export function extractAllAppIdsFromMessages(
  messages: { role: string; content: string }[],
): Set<string> {
  const allAppIds = new Set<string>();

  messages.forEach((message) => {
    if (message.role === "user" && message.content) {
      const appIds = extractAppIds(message.content);
      appIds.forEach((id) => allAppIds.add(id));
    }
  });

  return allAppIds;
}
