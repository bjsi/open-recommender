import { z } from "zod";

export const filterSearchResultsOutputSchema = z.object({
  recommendedVideos: z.array(
    z.object({
      id: z.number(),
      relevance: z.number().describe("Relevance is a float between 0 and 1."),
    })
  ),
});

export type FilterSearchResultsOutput = z.infer<
  typeof filterSearchResultsOutputSchema
>;
