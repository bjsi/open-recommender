import { z } from "zod";

export const recursiveTwitterSummarizerInputSchema = z.object({
  tweets: z.string(),
  user: z.string(),
  bio: z.string(),
});

export type RecursiveTwitterSummarizerInput = z.infer<
  typeof recursiveTwitterSummarizerInputSchema
>;
