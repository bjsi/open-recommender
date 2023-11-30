import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Prompt } from "./prompt";
import OpenAI from "openai";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 * We don't need to input the entire transcript, just a few paragraphs.
 */

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
Given a transcript of a video, evaluate whether the video is likely to be low-quality SEO spam. Consider the following characteristics when making your assessment:
- **Use of Buzzwords and Jargon**: Look for an overuse of sensationalist or trendy terms like "revolutionize," "game-changing," "transformative," etc., without substantial context or explanation.
- **Vagueness and Lack of Specific Details**: Identify if the transcript lacks specific, concrete information about the topics discussed, and instead uses broad, sweeping statements.
- **Repetitive and Redundant Language**: Check for the repetition of the same ideas or phrases, which might indicate an attempt to optimize for certain keywords rather than provide informative content.
- **Clickbait-style Elements**: Determine if the title or content of the transcript seems designed to attract viewers through sensationalism or exaggerated claims rather than substantive content.
- **Unsubstantiated Claims and Speculation**: Look for bold claims about future technologies or effects without evidence, data, or references to back them up.
- **Overpromising and Excessive Speculation**: Assess whether the transcript makes unrealistic promises about the future or engages in speculation without acknowledging the uncertainty.
- **Lack of Originality or Unique Insights**: Evaluate if the content offers any new perspectives, insights, or unique information, or if it simply rehashes commonly known information.

Based on these criteria, provide an assessment of whether the video should be recommended to the user. Include one sentence explaining your reasoning.
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

export type AppraiseTranscriptInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  reasoning: z.string(),
  recommend: z.boolean(),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "appraiseTranscript",
  description:
    "Appraise a video transcript and decide whether to recommend it to the user.",
  parameters: zodToJsonSchema(outputSchema),
};

export const appraiseTranscript = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-4-1106-preview",
  inputSchema: inputSchema,
});
