import { z } from "zod";
import { RecommendationWithVotes } from "./recommendation";

export const getRecommendationsInputSchema = z.object({
  username: z.string(),
});

export type GetRecommendationsInput = z.infer<
  typeof getRecommendationsInputSchema
>;

export interface GetRecommendationsOutput {
  recommendations: RecommendationWithVotes[];
}
