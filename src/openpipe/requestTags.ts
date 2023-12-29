import { z } from "zod";

export const requestTagsAlpha = z.object({
  pipelineRunId: z.string(),
  twitterUserName: z.string(),
  promptName: z.string(),
});

export type RequestTagsAlpha = z.infer<typeof requestTagsAlpha>;

export type RequestTagsLatest = RequestTagsAlpha;

export type RequestTagsWithoutName = Omit<RequestTagsLatest, "promptName">;

export const createRequestTags = (args: {
  runId: string;
  user: string;
}): RequestTagsWithoutName => {
  return {
    pipelineRunId: args.runId,
    twitterUserName: args.user,
  };
};
