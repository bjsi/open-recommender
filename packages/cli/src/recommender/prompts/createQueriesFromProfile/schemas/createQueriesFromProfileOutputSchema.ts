import { z } from "zod";

export const createQueriesFromProfileOutputSchema = z.object({
  queries: z.string().array(),
});

export type CreateQueriesFromProfileInput = z.infer<
  typeof createQueriesFromProfileOutputSchema
>;
