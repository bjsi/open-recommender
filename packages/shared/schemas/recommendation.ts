import { z } from "zod";

export const recommendationSchema = z.object({
  type: z.literal("youtube"),
  id: z.number(),
  data: z.object({
    title: z.string(),
    summary: z.string(),
    url: z.string(),
  }),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

export const recommendationWithVotesSchema = recommendationSchema.extend({
  votes: z
    .object({
      vote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
      userId: z.number(),
    })
    .array(),
});

export type RecommendationWithVotes = z.infer<
  typeof recommendationWithVotesSchema
>;
