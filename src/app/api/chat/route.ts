import { createDataStreamResponse } from "ai";
import { type NextRequest } from "next/server";
import { auth } from "@/server/auth";
import {
  storeComparisonResults,
  getComparisonResultsFromDb,
} from "@/server/review-analyzer/services/dbService";
import { safeSerialize, sendStatus } from "./utils";
import { generateComparison } from "./comparison";
import { processAppAnalysis } from "./appAnalysis";
import type { AppAnalysisResult } from "@/types";
import { db } from "@/server/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as {
      slug: string;
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
    const userEmail = session.user.email || "unknown";

    // Create a parent trace ID for grouping all AI calls
    const parentTraceId = randomUUID();

    // If analysis ID is provided, load app IDs from the analysis record
    const analysis = await db.analysis.findUnique({
      where: { slug },
      include: {
        analysisApps: {
          include: {
            app: true,
          },
        },
      },
    });

    if (!analysis) {
      return new Response(JSON.stringify({ error: "Analysis not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user has access to this analysis
    if (analysis.userId && analysis.userId !== userId) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize app IDs array
    const allAnalysisApps = analysis.analysisApps.map((aa) => ({
      id: aa.id,
      appStoreId: aa.appStoreId,
    }));

    // Create a data stream response
    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          // Update status messages to be more specific
          sendStatus(
            dataStream,
            "analyzing",
            `Analyzing ${allAnalysisApps.length} app${
              allAnalysisApps.length > 1 ? "s" : ""
            }: ${allAnalysisApps.map((aa) => aa.appStoreId).join(", ")}`,
          );

          // Store app info and analysis results for all apps
          const appAnalyses: AppAnalysisResult[] = [];

          // Process all apps in parallel
          const analysisPromises = allAnalysisApps.map((aa) =>
            processAppAnalysis(aa.id, aa.appStoreId, dataStream, userId, {
              traceId: parentTraceId,
              userEmail,
            }),
          );

          // Wait for all analyses to complete
          const results = await Promise.all(analysisPromises);

          // Filter out null results (failed analyses)
          const validResults = results.filter(
            (result): result is AppAnalysisResult => result !== null,
          );
          appAnalyses.push(...validResults);

          // Generate and send cross-app comparison if we have multiple apps in total
          if (allAnalysisApps.length > 1 && appAnalyses.length > 1) {
            sendStatus(
              dataStream,
              "analyzing",
              `Generating cross-app comparison for ${appAnalyses.length} apps...`,
            );

            // Check if we have existing comparison results in the database
            const existingComparisonResult = await getComparisonResultsFromDb(
              appAnalyses.map((app) => app.appInfo.id),
            );

            if (
              existingComparisonResult &&
              existingComparisonResult.appAnalyses.length === appAnalyses.length
            ) {
              // If we have existing comparison, use it
              sendStatus(
                dataStream,
                "processing",
                `Retrieved existing comparison for ${appAnalyses.length} apps...`,
              );

              // Send the existing comparison data to the client
              dataStream.writeData(
                safeSerialize(existingComparisonResult.comparisonData),
              );
            } else {
              // Generate new comparison
              const comparisonData = await generateComparison(appAnalyses, {
                traceId: parentTraceId,
                userEmail,
              });
              dataStream.writeData(safeSerialize(comparisonData));
              console.log(analysis.id);
              await storeComparisonResults(
                analysis.id,
                appAnalyses.map((app) => app.appInfo.id),
                comparisonData,
              );
            }
          }

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
