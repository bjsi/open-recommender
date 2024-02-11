import { z } from "zod";

export const articleSnippetSchema = z.object({
  type: z.literal("article"),
  title: z.string(),
  question: z.string(),
  text: z.string(),
  articleTitle: z.string(),
  articleUrl: z.string(),
});

export type ArticleSnippet = z.infer<typeof articleSnippetSchema>;

export const articleSnippetWithScore = articleSnippetSchema.extend({
  score: z.number(),
  rank: z.number(),
});

export type ArticleSnippetWithScore = z.infer<typeof articleSnippetWithScore>;
