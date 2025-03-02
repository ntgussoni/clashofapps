import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { nextCookies } from "better-auth/next-js";
import { admin, magicLink } from "better-auth/plugins";
import { sendMagicLink } from "../emails/send-magic-link";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  plugins: [
    admin(),
    magicLink({
      sendMagicLink,
    }),
    nextCookies(),
  ],
});
