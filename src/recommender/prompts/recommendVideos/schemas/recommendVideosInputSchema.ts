import { z } from "zod";

export const recommendVideosInputSchema = z.object({
  tweets: z.string(),
  results: z.string(),
  query: z.string(),
});

export type RecommendVideosInput = z.infer<typeof recommendVideosInputSchema>;
