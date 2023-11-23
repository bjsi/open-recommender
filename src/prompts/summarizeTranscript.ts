import { ChatCompletionMessageParam } from "openai/resources";
import { compilePrompt } from "./compilePrompt";
import { isMain } from "../utils";
import { readFileSync } from "fs";
import { dataFolder } from "../filesystem";
import { parse } from "path";
import { parseSync } from "subtitle";
import { parseTranscript } from "../youtube";

/**
 * Recursively summarise a transcript into a paragraph.
 * TODO: handle long transcripts.
 */

export const summarizeTranscriptPrompt: ChatCompletionMessageParam[] = [
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

export interface SummarizeTranscriptVars {
  transcript: string;
  videoTitle: string;
}

export async function appraiseTranscript(args: SummarizeTranscriptVars) {
  const prompt = compilePrompt(summarizeTranscriptPrompt, args);
  const response = await openai.chat(prompt);
  return response;
}

if (isMain(import.meta.url)) {
  (async () => {
    const exampleTranscript = JSON.parse(readFileSync(dataFolder, "utf-8"));
    const parsedTranscript = parseTranscript(exampleTranscript);
    const response = await appraiseTranscript({
      transcript: "This is a test",
      videoTitle: "Test video",
    });
    console.log(response);
  })();
}
