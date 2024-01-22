import { z } from "zod";

export const YouTubeRecommendationSource = z.object({
  type: z.literal("youtube"),
  id: z.string(),
  title: z.string(),
});

export type YouTubeRecommendationSource = z.infer<
  typeof YouTubeRecommendationSource
>;
