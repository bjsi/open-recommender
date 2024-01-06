import { z } from "zod";

export const createQueriesInputSchema = z.object({
  user: z.string(),
  tweets: z.string(),
});

export type CreateQueriesInput = z.infer<typeof createQueriesInputSchema>;
