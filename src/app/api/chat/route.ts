import { createDataStreamResponse } from "ai";
import { type NextRequest } from "next/server";
import { auth } from "@/server/auth";
import {
  storeComparisonResults,
  getComparisonResultsFromDb,
} from "@/server/review-analyzer/services/dbService";
import {
  extractAppIds,
  extractAllAppIdsFromMessages,
  safeSerialize,
  sendStatus,
} from "./utils";
import { generateComparison } from "./comparison";
import { processAppAnalysis } from "./appAnalysis";
import type { AppAnalysisResult } from "./types";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: string; content: string }[];
    };

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;

    // Get the user's latest message
    const userMessage = messages[messages.length - 1];

    if (!userMessage || userMessage.role !== "user") {
      throw new Error("Missing or invalid user message");
    }

    // Extract app IDs from the user's request
    const input = userMessage.content;
    const newAppIds = extractAppIds(input);

    // Get all app IDs from previous messages to ensure we include previously analyzed apps
    const allAppIdsSet = extractAllAppIdsFromMessages(messages);

    // Add new app IDs to the set
    newAppIds.forEach((id) => allAppIdsSet.add(id));

    // Convert set to array
    const allAppIds = Array.from(allAppIdsSet);

    // Verify user has access to these apps
    if (allAppIds.length > 0) {
      // Check if the user has analyses that include these app IDs
      const userAnalyses = await db.analysis.findMany({
        where: {
          userId: userId,
        },
        include: {
          analysisApps: {
            where: {
              appId: {
                in: allAppIds,
              },
            },
            select: {
              appId: true,
            },
          },
        },
      });

      // Extract all app IDs the user has access to
      const accessibleAppIds = new Set<string>();
      userAnalyses.forEach((analysis) => {
        analysis.analysisApps.forEach((app) => {
          accessibleAppIds.add(app.appId);
        });
      });

      // Check if there are any app IDs the user doesn't have access to
      const unauthorizedAppIds = allAppIds.filter(
        (appId) => !accessibleAppIds.has(appId),
      );

      if (unauthorizedAppIds.length > 0) {
        return new Response(
          JSON.stringify({
            error: `You don't have access to the following apps: ${unauthorizedAppIds.join(", ")}`,
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Create a data stream response
    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          // Update status messages to be more specific
          sendStatus(
            dataStream,
            "analyzing",
            `Analyzing ${newAppIds.length} new app${
              newAppIds.length > 1 ? "s" : ""
            }: ${newAppIds.join(", ")}`,
          );

          // Store app info and analysis results for all apps
          let appAnalyses: AppAnalysisResult[] = [];

          // Process all apps in parallel
          const analysisPromises = newAppIds.map((appId) =>
            processAppAnalysis(appId, dataStream, userId),
          );

          // Wait for all analyses to complete
          const results = await Promise.all(analysisPromises);

          // Filter out null results (failed analyses)
          const validResults = results.filter(
            (result): result is AppAnalysisResult => result !== null,
          );
          appAnalyses.push(...validResults);

          // Generate and send cross-app comparison if we have multiple apps in total
          // This ensures comparison is generated even when adding just one new app
          if (allAppIds.length > 1 && appAnalyses.length > 1) {
            sendStatus(
              dataStream,
              "analyzing",
              `Generating cross-app comparison for ${appAnalyses.length} apps...`,
            );

            // Check if we have existing comparison results in the database
            const existingComparison =
              await getComparisonResultsFromDb(allAppIds);

            if (
              existingComparison &&
              existingComparison.appAnalyses.length === appAnalyses.length
            ) {
              // If we have existing comparison, use it
              sendStatus(
                dataStream,
                "processing",
                `Retrieved existing comparison for ${appAnalyses.length} apps...`,
              );

              // Update app info in the comparison data
              existingComparison.appAnalyses.forEach((analysis) => {
                const matchingApp = appAnalyses.find(
                  (app) => app.appInfo.appId === analysis.appInfo.appId,
                );
                if (matchingApp) {
                  analysis.appInfo = matchingApp.appInfo;
                  analysis.analysisResults.appName = matchingApp.appInfo.name;
                }
              });

              // Send the existing comparison data to the client
              dataStream.writeData(
                safeSerialize(existingComparison.comparisonData),
              );

              // Replace appAnalyses with the data from the existing comparison
              appAnalyses = existingComparison.appAnalyses;
            } else {
              // Generate new comparison
              const comparisonData = await generateComparison(
                appAnalyses,
                userId,
              );
              dataStream.writeData(safeSerialize(comparisonData));

              // Store the comparison in the database
              if (userId) {
                await storeComparisonResults(
                  userId,
                  appAnalyses,
                  comparisonData,
                );
              }
            }
          }

          // The AI summary generation was commented out in the original code, so keeping it that way

          // If all analyses failed, send completed status
          if (appAnalyses.length === 0) {
            sendStatus(
              dataStream,
              "completed",
              "Analysis completed, but no valid results were found.",
            );
          } else {
            sendStatus(
              dataStream,
              "completed",
              "Analysis completed successfully.",
            );
          }
        } catch (error) {
          console.error("Error in app analysis:", error);

          // Send error status to client
          sendStatus(
            dataStream,
            "error",
            `Error analyzing app: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      },
      onError: (error) => {
        // Return a proper error message for the client
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error: unknown) {
    console.error("Error in chat processing:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to process request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
