import { Prompt } from "prompt-iteration-assistant";
import {
  AppraiseTranscriptInput,
  appraiseTranscriptInputSchema,
} from "./schemas/appraiseTranscriptInputSchema";
import { appraiseTrancriptOuputSchema } from "./schemas/appraiseTranscriptOutputSchema";
import { noTitlePrompt } from "./prompts/noTitlePrompt";
import { spamVideoDataset } from "./datasets/spamVideoDataset";
import { learningVideoDataSet } from "./datasets/learningVideoDataset";
import { firstNTokens } from "../recommendClips/helpers/splitTranscript";
import {
  TranscriptCue,
  transcriptCuesToVtt,
} from "../../../youtube/transcript";
import { openpipe } from "../../../openpipe/openpipe";

export const APPRAISE_TRANSCRIPT = "Appraise Transcript";

class AppraiseTranscriptPrompt extends Prompt<
  typeof appraiseTranscriptInputSchema,
  typeof appraiseTrancriptOuputSchema
> {
  constructor() {
    super({
      name: APPRAISE_TRANSCRIPT,
      description:
        "Appraise a video transcript and decide whether to recommend it to the user.",
      input: appraiseTranscriptInputSchema,
      output: appraiseTrancriptOuputSchema,
      prompts: [noTitlePrompt],
      model: "gpt-4",
      exampleData: [spamVideoDataset, learningVideoDataSet],
    });
  }

  async execute(args: {
    transcript: TranscriptCue[];
    title: string;
    enableOpenPipeLogging?: boolean;
  }) {
    const transcript = firstNTokens(transcriptCuesToVtt(args.transcript), 1000);
    const promptVariables: AppraiseTranscriptInput = {
      transcript,
      videoTitle: args.title,
    };
    if (!args.enableOpenPipeLogging) {
      return await appraiseTranscript().run({
        promptVariables: promptVariables,
        stream: false,
      });
    } else {
      return await openpipe.functionCall({
        input: this.input!,
        output: this.output!,
        vars: promptVariables,
        prompt: this.prompts[0],
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
      });
    }
  }
}

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 */
export const appraiseTranscript = () =>
  new AppraiseTranscriptPrompt()
    .withTest(
      "quality-250-tokens",
      {
        transcript: firstNTokens(learningVideoDataSet.transcript.value, 250),
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
      "quality-500-tokens",
      {
        transcript: firstNTokens(learningVideoDataSet.transcript.value, 500),
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
      "quality-1000-tokens",
      {
        transcript: firstNTokens(learningVideoDataSet.transcript.value, 1000),
      },
      (output) => {
        return {
          pass: output.recommend,
          score: output.recommend ? 1 : 0,
          reason: "",
        };
      }
    )
    // regularly fails - see here for analysis: https://x.com/experilearning/status/1735213419601461376?s=20
    .withTest(
      "spam-350-tokens",
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
      "spam-500-tokens",
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
      "spam-1000-tokens",
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
