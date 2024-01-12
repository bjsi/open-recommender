import { z } from "zod";

export const createQueriesFromProfileInputSchema = z.object({
  profile: z.string(),
  user: z.string(),
  bio: z.string(),
});

export type CreateQueriesFromProfileInput = z.infer<
  typeof createQueriesFromProfileInputSchema
>;
