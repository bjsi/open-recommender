import { z } from "zod";

export const ArticleRecommendation = z.object({
  type: z.literal("article"),
  title: z.string(),
  highlight: z.string(),
  url: z.string(),
});

export type ArticleRecommendation = z.infer<typeof ArticleRecommendation>;
