import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { compilePrompt } from "./compilePrompt";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 * We don't need to input the entire transcript, just a few paragraphs.
 */

export const appraiseTranscriptPrompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "",
  },
  {
    role: "user",
    content: `
Title: {{ videoTitle }}
Transcript: {{ transcript }}
`.trim(),
  },
];

export const appraiseTranscriptSchema = z.object({
  reasoning: z.string(),
  meetsStandards: z.boolean(),
});

export const appraiseTranscriptFunction: ChatCompletionMessage.FunctionCall = {
  name: "appraiseTranscript",
  arguments: JSON.stringify(zodToJsonSchema(appraiseTranscriptSchema)),
};

export interface AppraiseTranscriptVars {
  transcript: string;
  videoTitle: string;
}

export async function appraiseTranscript(args: AppraiseTranscriptVars) {
  const prompt = compilePrompt(appraiseTranscriptPrompt, args);
  const response = await openai.chat(prompt);
  return response;
}
