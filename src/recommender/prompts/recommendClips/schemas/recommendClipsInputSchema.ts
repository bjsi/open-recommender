import { z } from "zod";

export const recommendClipsInputSchema = z.object({
  transcript: z.string(),
  title: z.string(),
  tweets: z.string(),
});

export type RecommendClipsInput = z.infer<typeof recommendClipsInputSchema>;
