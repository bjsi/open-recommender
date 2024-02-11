import { User } from "@prisma/client";
import { Resend } from "resend";

export async function sendEmail(toUser: User, subject: string, html: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.NO_REPLY_EMAIL!,
    to: toUser.email,
    subject,
    html,
  });
}
