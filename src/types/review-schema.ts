import { z } from "zod";

/**
 * Schema for review insights data
 */
export const reviewInsightSchema = z.object({
  id: z.number().describe("Review ID"),
  text: z.string().describe("Review text"),
  rating: z.number().min(1).max(5).describe("Review rating (1-5)"),
  date: z.string().describe("Review date"),
  sentiment: z.number().min(-1).max(1).describe("Sentiment score (-1 to 1)"),
  features: z
    .array(z.string())
    .optional()
    .describe("Features mentioned in the review"),
  userId: z.string().optional().describe("User ID of the reviewer"),
  helpful: z.number().optional().describe("Number of helpful votes"),
  version: z.string().optional().describe("App version for this review"),
});
