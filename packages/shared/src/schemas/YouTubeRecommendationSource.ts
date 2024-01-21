import { z } from "zod";

// a full YT video

export const YouTubeRecommendationSourceModel = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  source: z.string(),
});

export type YouTubeRecommendationSource = z.infer<
  typeof YouTubeRecommendationSourceModel
>;
