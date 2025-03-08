import sendEmail from "./resend";
import RegisterTemplate from "@/emails/RegisterTemplate";
import type { magicLink } from "better-auth/plugins";

export const sendMagicLink: Parameters<
  typeof magicLink
>[0]["sendMagicLink"] = async (params) => {
  const { email } = params;
  await sendEmail({
    to: email,
    subject: "Your login link for clashofapps.com",
    text: `Your login link to clashofapps.com! Click the link below to sign in to your account:\n\n${params.url}`,
    react: RegisterTemplate({
      loginUrl: params.url,
    }),
  });
};
