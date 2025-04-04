import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { nextCookies } from "better-auth/next-js";
import { admin, createAuthMiddleware, magicLink } from "better-auth/plugins";
import { sendMagicLink } from "../emails/send-magic-link";
import * as Sentry from "@sentry/nextjs";

export const auth = betterAuth({
  trustedOrigins: ["https://www.clashofapps.com", "https://clashofapps.com"],
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://clashofapps.com"
      : "http://localhost:3000",
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: process.env.NODE_ENV !== "production",
    // Optional: Development-only password reset handler
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log("Development mode - Password reset link:", url);
      // In development, just log the reset link
      console.log(`Reset password token for ${user.email}: ${token}`);
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.newSession?.user && Sentry.setUser) {
        Sentry.setUser({ id: ctx.context.newSession.user.id });
      } else if (Sentry.setUser) {
        Sentry.setUser(null);
      }
    }),
  },
  plugins: [
    admin(),
    magicLink({
      sendMagicLink,
    }),
    nextCookies(),
  ],
});
