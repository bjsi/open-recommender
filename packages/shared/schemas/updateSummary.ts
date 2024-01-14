import { z } from "zod";

export const updateSummaryInputSchema = z.object({
  summaryId: z.number(),
  summary: z.string(),
  useForRecommendations: z.boolean(),
});

export type UpdateSummaryInput = z.infer<typeof updateSummaryInputSchema>;

export interface UpdateSummaryOutput {
  success: boolean;
}
