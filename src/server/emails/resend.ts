import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  from?: string;
  subject: string;
  text: string;
  react: React.ReactElement | React.ReactNode | null;
};
export default async function sendEmail({
  from = "clashofapps.com <no-reply@clashofapps.com>",
  react,
  subject,
  text,
  to,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    react,
  });

  if (error) {
    return error;
  }

  return data;
}
