import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { generateAnalysisSlug } from "@/utils/slug";

export const analysisRouter = createTRPCRouter({
  // Create a new analysis from app links
  create: protectedProcedure
    .input(
      z.object({
        appStoreIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { appStoreIds } = input;
      const userId = ctx.session.user.id;

      // Validate links and extract app IDs
      const validAppIds = appStoreIds.filter((link) => link.trim() !== "");

      if (validAppIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No valid links provided",
        });
      }

      // Generate a slug for the analysis
      const slug = generateAnalysisSlug(appStoreIds);

      // Create a transaction to ensure everything gets created properly
      const analysis = await db.$transaction(async (tx) => {
        // Create the analysis
        const analysis = await tx.analysis.create({
          data: {
            slug,
            userId,
          },
        });

        // Process each app ID
        for (const appStoreId of appStoreIds) {
          // Check if the app already exists in the database
          const app = await tx.app.findUnique({
            where: { appStoreId },
          });

          // If the app doesn't exist, create it with minimal data
          // (it will be populated with real data later in the process)
          if (!app) {
            // Create the link between the analysis and the app
            await tx.analysisApp.create({
              data: {
                analysisId: analysis.id,
                appStoreId,
              },
            });
          } else {
            // Create the link between the analysis and the app
            await tx.analysisApp.create({
              data: {
                analysisId: analysis.id,
                appId: app.id,
                appStoreId,
              },
            });
          }
        }

        return analysis;
      });

      // Return the slug for redirection
      return {
        success: true,
        slug: analysis.slug,
        id: analysis.id,
      };
    }),

  // Get analysis by slug
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      const userId = ctx.session.user.id;

      // Find the analysis by slug
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Analysis not found",
        });
      }

      // Check if the user owns this analysis or if the analysis has no owner
      if (analysis.userId && analysis.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this analysis",
        });
      }

      return {
        id: analysis.id,
        slug: analysis.slug,
        createdAt: analysis.createdAt,
      };
    }),

  // Get user's analyses
  getUserAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const analyses = await db.analysis.findMany({
      where: {
        userId,
      },
      include: {
        analysisApps: {
          include: {
            app: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return analyses
      .filter((analysis) => analysis.analysisApps.every((aa) => aa.app))
      .map((analysis) => ({
        id: analysis.id,
        slug: analysis.slug,
        appStoreIds: analysis.analysisApps.map((aa) => aa.app?.appStoreId),
        appNames: analysis.analysisApps.map((aa) => aa.app?.name),
        createdAt: analysis.createdAt,
      }));
  }),
});
