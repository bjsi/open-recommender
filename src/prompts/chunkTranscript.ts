/**
 * We chunk the transcript into logical sections using an LLM.
 * We could use YouTube's chapters, but they are not always available.
 * We also extract entities mentioned in each section.
 */

import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const chunkTranscriptPrompt: ChatCompletionMessageParam[] = [
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

export const chunkTranscriptSchema = z.object({
  sections: z.array(transcriptChunkSchema),
});

export const chunkTranscriptFunction: ChatCompletionMessage.FunctionCall = {
  name: "chunkTranscript",
  arguments: JSON.stringify(zodToJsonSchema(chunkTranscriptSchema)),
};

export interface TranscriptChunk {
  text: string;
  start: number;
  end: number;
  entities: string[];
}

export interface ChunkTranscriptVars {
  transcript: any;
  // including the video title and summary will
  // help the LLM to accurately extract entities
  videoTitle: string;
  videoSummary: string;
}

export async function chunkTranscript(args: ChunkTranscriptVars) {}
