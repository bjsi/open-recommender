import { Prompt } from "prompt-iteration-assistant";
import { appraiseTranscriptInputSchema } from "./schemas/appraiseTranscriptInputSchema";
import { appraiseTrancriptOuputSchema } from "./schemas/appraiseTranscriptOutputSchema";
import { noTitlePrompt } from "./prompts/noTitlePrompt";
import { spamVideoDataset } from "./datasets/spamVideoDataset";
import { learningVideoDataSet } from "./datasets/learningVideoDataset";
import { firstNTokens } from "../createClips/helpers/splitTranscript";

export const APPRAISE_TRANSCRIPT = "Appraise Transcript";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 * We don't need to input the entire transcript, just a few paragraphs.
 */
export const appraiseTranscript = () =>
  new Prompt<
    typeof appraiseTranscriptInputSchema,
    typeof appraiseTrancriptOuputSchema
  >({
    state: {},
    name: APPRAISE_TRANSCRIPT,
    description:
      "Appraise a video transcript and decide whether to recommend it to the user.",
    input: appraiseTranscriptInputSchema,
    output: appraiseTrancriptOuputSchema,
    prompts: [noTitlePrompt],
    model: "gpt-4",
    exampleData: [spamVideoDataset, learningVideoDataSet],
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
      "reject-spam-350-tokens",
      {
        transcript: firstNTokens(spamVideoDataset.transcript.value, 350),
      },
      (output) => {
        return {
          pass: !output.recommend,
          score: output.recommend ? 0 : 1,
          reason: "",
        };
      }
    )
    .withTest(
      "reject-spam-500-tokens",
      {
        transcript: firstNTokens(spamVideoDataset.transcript.value, 500),
      },
      (output) => {
        return {
          pass: !output.recommend,
          score: output.recommend ? 0 : 1,
          reason: "",
        };
      }
    )
    .withTest(
      "reject-spam-1000-tokens",
      {
        transcript: firstNTokens(spamVideoDataset.transcript.value, 1000),
      },
      (output) => {
        return {
          pass: !output.recommend,
          score: output.recommend ? 0 : 1,
          reason: "",
        };
      }
    );
