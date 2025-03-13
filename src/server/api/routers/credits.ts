import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const creditsRouter = createTRPCRouter({
  // Get current user's credits
  getMyCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { credits: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user.credits;
  }),

  // Get credits for a specific user (admin only)
  getUserCredits: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Only admins can view other users' credits
      if (
        input.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view other users' credits",
        });
      }

      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { credits: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user.credits;
    }),

  // Check if user has enough credits
  hasEnoughCredits: protectedProcedure
    .input(z.object({ amount: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user.credits >= input.amount;
    }),

  // Deduct credits from the current user
  deductCredits: protectedProcedure
    .input(z.object({ amount: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.credits < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough credits",
        });
      }

      const updatedUser = await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          credits: {
            decrement: input.amount,
          },
        },
        select: { credits: true },
      });

      return updatedUser.credits;
    }),

  // Get all user credits (admin only)
  getAllUserCredits: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.session.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view all user credits",
      });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        credits: true,
      },
    });

    return users;
  }),

  // Add credits to a user (admin only)
  addCreditsToUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can add credits to users",
        });
      }

      try {
        const user = await db.user.update({
          where: { id: input.userId },
          data: {
            credits: {
              increment: input.amount,
            },
          },
          select: { credits: true, name: true, email: true },
        });

        return {
          success: true,
          message: `Added ${input.amount} credits to ${user.name || user.email}`,
          newBalance: user.credits,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add credits",
          cause: error,
        });
      }
    }),
});
