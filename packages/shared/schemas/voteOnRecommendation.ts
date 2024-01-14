import { z } from "zod";

export const voteSchema = z.union([z.literal(1), z.literal(-1), z.literal(0)]);
export type Vote = z.infer<typeof voteSchema>;

export const voteOnRecommendationInputSchema = z.object({
  recommendationId: z.number(),
  vote: voteSchema,
});

export type VoteOnRecommendationInput = z.infer<
  typeof voteOnRecommendationInputSchema
>;

export const voteOnRecommendationOutputSchema = z.object({
  vote: voteSchema,
});

export type VoteOnRecommendationOutput = z.infer<
  typeof voteOnRecommendationOutputSchema
>;
