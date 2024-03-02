import { User } from "@prisma/client";
import { Resend } from "resend";
import { AddRecommendationInput } from "./addRecomendations";
import RecommendationsEmail from "./email/RecommendationsEmail";
import React from "react";

const subjectLines = [
  "Fresh recommendations",
  "New nuggets",
  "New recommendations",
];

export async function sendRecommendationsEmail(
  toUser: User,
  input: AddRecommendationInput
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = subjectLines[Math.floor(Math.random() * subjectLines.length)];
  await resend.emails.send({
    from: process.env.NO_REPLY_EMAIL!,
    to: toUser.email,
    subject,
    react: <RecommendationsEmail input={input} />,
  });
}
