import { z } from "zod";

/**
 * Schema for sentiment analysis data
 */
export const sentimentSchema = z.object({
  neutral: z.array(z.string()).describe("Neutral sentiment statements"),
  overall: z.string().describe("Overall sentiment summary"),
  positive: z.array(z.string()).describe("Positive sentiment statements"),
  negative: z.array(z.string()).describe("Negative sentiment statements"),
  mixed: z.array(z.string()).describe("Mixed sentiment statements"),
  reviewMap: z
    .record(z.string(), z.array(z.number()))
    .describe("Mapping of sentiment to review IDs"),
});
