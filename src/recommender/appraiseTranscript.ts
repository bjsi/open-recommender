import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Prompt } from "./prompt";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 * We don't need to input the entire transcript, just a few paragraphs.
 *
 * User context will initially be information taken from the user's Twitter profile.
 * Later we can use the user's video viewing history.
 */

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
You are a YouTube video recommendation system that recommends videos to users based on their interests.
You are given a transcript of a video and its title.
You must decide whether to recommend the video to the user.

User Context: {{ userContext }}
`.trim(),
  },
  {
    role: "user",
    content: `
Title: {{ videoTitle }}

{{ transcript }}
`.trim(),
  },
];

const inputSchema = z.object({
  transcript: z.string(),
  videoTitle: z.string(),
  userContext: z.string(),
});

export type AppraiseTranscriptVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  reasoning: z.string(),
  recommend: z.boolean(),
});

const functionCall: ChatCompletionMessage.FunctionCall = {
  name: "appraiseTranscript",
  arguments: JSON.stringify(zodToJsonSchema(outputSchema)),
};

export const appraiseTranscript = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-3.5-turbo",
  inputSchema: inputSchema,
});
