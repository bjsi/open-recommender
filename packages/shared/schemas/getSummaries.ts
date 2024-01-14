import { z } from "zod";
import { Summary } from "../types/summary";

export const getSummariesSchema = z.object({
  username: z.string(),
});

export type GetSummariesInput = z.infer<typeof getSummariesSchema>;

export interface GetSummariesOutput {
  summaries: Summary[];
}
