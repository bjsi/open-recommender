import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { ExampleDataSet, Prompt } from "./prompt";
import { transcriptToString } from "../youtube/transcript";
import {
  learningVideoTranscript,
  spamVideoTranscript,
} from "./tests/exampleData";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 * We don't need to input the entire transcript, just a few paragraphs.
 */

const inputSchema = z.object({
  transcript: z.string(),
  videoTitle: z.string().optional(),
});

export type AppraiseTranscriptInputVars = z.infer<typeof inputSchema>;

const onlyTranscriptPrompt = {
  name: "only-transcript",
  compile: (
    args: AppraiseTranscriptInputVars
  ): ChatCompletionMessageParam[] => [
    {
      role: "system" as const,
      content: `
# Instructions
Given a transcript of a video, evaluate whether the video is likely to be low-quality SEO spam. Consider the following characteristics when making your assessment:
- **Use of Buzzwords and Jargon**: Look for an overuse of sensationalist or trendy terms like "revolutionize," "game-changing," "transformative," etc., without substantial context or explanation.
- **Vagueness and Lack of Specific Details**: Identify if the transcript lacks specific, concrete information about the topics discussed, and instead uses broad, sweeping statements.
- **Clickbait-style Elements**: Determine if the content of the transcript seems designed to attract viewers through sensationalism or exaggerated claims rather than substantive content.
- **Unsubstantiated Claims and Speculation**: Look for bold claims about future technologies or effects without evidence, data, or references to back them up.
- **Overpromising and Excessive Speculation**: Assess whether the transcript makes unrealistic promises about the future or engages in speculation without acknowledging the uncertainty.

Based on these criteria, provide a one sentence assessment of whether the video should be recommended to the user.
`.trim(),
    },
    {
      role: "user",
      content: `
# Transcript
${args.transcript}
`.trim(),
    },
  ],
};

const withVideoTitlePrompt = {
  name: "with-video-title",
  compile: (
    args: AppraiseTranscriptInputVars
  ): ChatCompletionMessageParam[] => [
    onlyTranscriptPrompt.compile(args)[0],
    {
      role: "user",
      content: `
# Video Title
${args.videoTitle}
# Transcript
${args.transcript}
`.trim(),
    },
  ],
};

const outputSchema = z.object({
  reasoning: z.string(),
  recommend: z.boolean(),
});

const learningVideoDataSet: ExampleDataSet<typeof inputSchema> = {
  transcript: {
    name: "Learning Video",
    key: "transcript",
    value: transcriptToString(learningVideoTranscript.cues).slice(0, 5000),
  },
  videoTitle: {
    name: "Learning Video Title",
    key: "videoTitle",
    value: learningVideoTranscript.videoTitle,
  },
};

const spamVideoDataSet: ExampleDataSet<typeof inputSchema> = {
  transcript: {
    name: "Spam Video",
    key: "transcript",
    value: spamVideoTranscript,
  },
  videoTitle: {
    name: "Spam Video Title",
    key: "videoTitle",
    value: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
  },
};

export const appraiseTranscript = new Prompt({
  name: "appraiseTranscript",
  description:
    "Appraise a video transcript and decide whether to recommend it to the user.",
  input: inputSchema,
  output: outputSchema,
  prompts: [onlyTranscriptPrompt, withVideoTitlePrompt],
  model: "gpt-4",
  exampleData: [
    ...Object.values(learningVideoDataSet),
    ...Object.values(spamVideoDataSet),
  ],
})
  .withTest(
    "recommend-quality",
    {
      transcript: learningVideoDataSet.transcript.value,
    },
    (output) => {
      return {
        pass: output.recommend,
        score: output.recommend ? 1 : 0,
        reason: "",
      };
    }
  )
  .withTest(
    "reject-spam",
    {
      transcript: spamVideoDataSet.transcript.value,
    },
    (output) => {
      return {
        pass: !output.recommend,
        score: output.recommend ? 0 : 1,
        reason: "",
      };
    }
  );

if (require.main === module) {
  appraiseTranscript.runCLI();
}
