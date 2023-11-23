import { ChatCompletionMessageParam } from "openai/resources";
import { compilePrompt } from "./compilePrompt";

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

export async function summarizeTranscript(args: SummarizeTranscriptVars) {
  const prompt = compilePrompt(summarizeTranscriptPrompt, args);
  const response = await openai.chat(prompt);
  return response;
}
