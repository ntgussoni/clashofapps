import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const reviewsRouter = createTRPCRouter({
  getReviewsByIds: publicProcedure
    .input(z.object({ reviewIds: z.array(z.number()) }))
    .query(async ({ input }) => {
      const { reviewIds } = input;

      if (!reviewIds.length) return [];
      console.log(reviewIds);
      const reviews = await db.appReview.findMany({
        where: {
          id: {
            in: reviewIds,
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
