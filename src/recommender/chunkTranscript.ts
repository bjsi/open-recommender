import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Prompt } from "./prompt";
import OpenAI from "openai";

/**
 * We chunk the transcript into logical sections and add metadata using an LLM.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `

`.trim(),
  },
  {
    role: "user",
    content: `
  `.trim(),
  },
];

const transcriptChunkSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  entities: z.array(z.string()),
});

export type TranscriptChunk = z.infer<typeof transcriptChunkSchema>;

const outputSchema = z.object({
  sections: z.array(transcriptChunkSchema),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "chunkTranscript",
  description: "Chunk a video transcript into logical sections with metadata.",
  parameters: zodToJsonSchema(outputSchema),
};

const inputSchema = z.object({
  transcript: z.string(),
  videoTitle: z.string(),
});

export type ChunkTranscriptVars = z.infer<typeof inputSchema>;

export const chunkTranscript = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-3.5-turbo",
  inputSchema,
});
