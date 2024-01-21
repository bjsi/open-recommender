import { z } from "zod";

export const YouTubeRecommendation = z.object({
  type: z.literal("youtube"),
  title: z.string(),
  summary: z.string(),
  url: z.string(),
});

export type YouTubeRecommendation = z.infer<typeof YouTubeRecommendation>;
