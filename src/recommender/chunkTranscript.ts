import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Prompt } from "./prompt";
import OpenAI from "openai";
import { learningVideoTranscript } from "./tests/exampleData";
import { transcriptCuesToVtt } from "../youtube/transcript";
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "./textSplitter";
import { tokenize } from "../tokenize";

/**
 * We chunk the transcript into logical sections and add metadata using an LLM.
 * We could use YouTube's chapters, but they are not always available, accurate or granular enough.
 */

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
- You are a YouTube video editor adding chapters with metadata to a video transcript.
- Aim to make the length of each chapter between 1 and 2 minutes.
- Include a one sentence summary of the section.
- Include tags.
`.trim(),
  },
  {
    role: "user",
    content: `
Title: {{ title }}
{{ transcript }}
  `.trim(),
  },
];

const inputSchema = z.object({
  transcript: z.string(),
  title: z.string(),
});

export type ChunkTranscriptVars = z.infer<typeof inputSchema>;

export const rejectedChunkTags = ["Intro", "Outro", "Advert", "Sponsor"];

const chapterSchema = z.object({
  title: z.string(),
  summary: z.string().describe("A one sentence summary of the section."),
  start: z.string(), // TODO: format?
  end: z.string(), // TODO: format?
  tags: z.array(
    z.union([
      z.literal("Intro"),
      z.literal("Outro"),
      z.literal("Advert"),
      z.literal("Sponsor"),
      z.string(),
    ])
  ),
});

export type TranscriptChunk = z.infer<typeof chapterSchema>;

const outputSchema = z.object({
  sections: z.array(chapterSchema),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "addChapters",
  description: "Chunk a video transcript into logical sections with metadata.",
  parameters: zodToJsonSchema(outputSchema),
};

export const chunkTranscript = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-4",
  inputSchema,
});

export const splitTranscript = async (text: string) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: 4000, // roughly 10-15 minutes of video
    chunkOverlap: 100, // not sure if this is necessary
    lengthFunction: async (x) => (await tokenize(x)).length,
  }).splitText(text);
  return parts;
};

if (require.main === module) {
  (async () => {
    dotenv.config();
    const webvttText = transcriptCuesToVtt(learningVideoTranscript.cues);
    const parts = await splitTranscript(webvttText);
    const fstPart = parts[0];
    console.log(fstPart);

    chunkTranscript
      .run({
        promptVars: {
          transcript: fstPart,
          title: learningVideoTranscript.videoTitle,
        },
      })
      .then((result) => {
        console.log(JSON.stringify(result, null, 2));
      })
      .catch((err) => {
        console.error(err);
      });
  })();
}
