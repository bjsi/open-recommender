import { z } from "zod";

// a clip from a video

export const YouTubeRecommendationModel = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type YouTubeRecommendation = z.infer<typeof YouTubeRecommendationModel>;
