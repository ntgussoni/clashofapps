import { db } from "@/server/db";

/**
 * Get a user's credit balance
 *
 * @param userId The user ID to get credits for
 * @returns The user's credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}

/**
 * Add credits to a user's account
 *
 * @param userId The user ID to add credits to
 * @param amount The amount of credits to add
 * @returns The new credit balance
 */
export async function addCredits(
  userId: string,
  amount: number,
): Promise<number> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const user = await db.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: amount,
      },
    },
    select: { credits: true },
  });

  return user.credits;
}

/**
 * Deduct credits from a user's account
 *
 * @param userId The user ID to deduct credits from
 * @param amount The amount of credits to deduct
 * @returns The new credit balance
 */
export async function deductCredits(
  userId: string,
  amount: number,
): Promise<number> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  // Check if user has enough credits
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user || user.credits < amount) {
    throw new Error("Insufficient credits");
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: amount,
      },
    },
    select: { credits: true },
  });

  return updatedUser.credits;
}

/**
 * Check if a user has enough credits
 *
 * @param userId The user ID to check
 * @param amount The amount of credits needed
 * @returns Boolean indicating if user has enough credits
 */
export async function hasEnoughCredits(
  userId: string,
  amount: number,
): Promise<boolean> {
  if (amount <= 0) return true;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return !!user && user.credits >= amount;
}
