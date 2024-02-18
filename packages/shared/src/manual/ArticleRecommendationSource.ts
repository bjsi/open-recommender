import { z } from "zod";

export const ArticleRecommendationSource = z.object({
  type: z.literal("article"),
  url: z.string(),
  title: z.string(),
});

export type ArticleRecommendationSource = z.infer<
  typeof ArticleRecommendationSource
>;
