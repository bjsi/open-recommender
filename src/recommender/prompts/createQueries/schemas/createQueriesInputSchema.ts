import { z } from "zod";

export const createQueriesInputSchema = z.object({
  tweets: z.string(),
});

export type CreateQueriesInput = z.infer<typeof createQueriesInputSchema>;
