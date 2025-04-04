import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  getReviewsByIds: protectedProcedure
    .input(z.object({ reviewIds: z.array(z.number()) }))
    .query(async ({ input, ctx }) => {
      const { reviewIds } = input;
      const userId = ctx.session.user.id;

      if (!reviewIds.length) return [];

      // Check if the user has access to these reviews
      // First get all analyses owned by this user
      const userAnalyses = await db.analysis.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      const userAnalysisIds = userAnalyses.map((analysis) => analysis.id);

      if (userAnalysisIds.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to any analyses",
        });
      }

      // Get app IDs associated with user's analyses
      const analysisApps = await db.analysisApp.findMany({
        where: {
          analysisId: {
            in: userAnalysisIds,
          },
        },
        select: {
          appId: true,
        },
      });

      const userAppIds = analysisApps.map((app) => app.appId);

      if (userAppIds.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to any apps",
        });
      }

      // Get reviews that belong to these app IDs
      const reviews = await db.appReview.findMany({
        where: {
          id: {
            in: reviewIds,
          },
          appId: {
            in: userAppIds.filter((id): id is number => id !== null),
          },
        },
        select: {
          id: true,
          reviewId: true,
          userName: true,
          userImage: true,
          date: true,
          score: true,
          title: true,
          text: true,
          thumbsUp: true,
          version: true,
        },
      });

      return reviews;
    }),
});
