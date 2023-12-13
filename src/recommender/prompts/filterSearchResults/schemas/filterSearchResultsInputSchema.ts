import { z } from "zod";

export const filterSearchResultsInputSchema = z.object({
  tweets: z.string(),
  results: z.string(),
  query: z.string(),
});
