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
import {
  RequestTagsAlpha,
  RequestTagsLatest,
} from "../../../openpipe/requestTags";

export const APPRAISE_TRANSCRIPT = "Appraise Transcript";

/**
 * We run some quality and "taste" checks on the transcript to
 * check that the video meets our standards before further processing.
 */
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
    openPipeRequestTags?: Omit<RequestTagsLatest, "promptName">;
    enableOpenPipeLogging?: boolean;
  }) {
    const transcript = firstNTokens(transcriptCuesToVtt(args.transcript), 1000);
    const promptVariables: AppraiseTranscriptInput = {
      transcript,
      videoTitle: args.title,
    };
    return await openpipe.functionCall({
      function: {
        input: this.input!,
        output: this.output!,
        name: this.name,
        description: this.description,
      },
      vars: promptVariables,
      prompt: this.prompts[0],
      body: {
        max_tokens: this.max_tokens,
        temperature: this.temperature,
        model: this.model,
      },
      openPipeRequestTags: args.openPipeRequestTags
        ? {
            ...args.openPipeRequestTags,
            promptName: this.name,
          }
        : undefined,
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
  }
}

export const appraiseTranscript = () =>
  new AppraiseTranscriptPrompt()
    .withTest(
      {
        name: "quality-250-tokens",
        vars: {
          transcript: firstNTokens(learningVideoDataSet.transcript.value, 250),
        },
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
      {
        name: "quality-500-tokens",
        vars: {
          transcript: firstNTokens(learningVideoDataSet.transcript.value, 500),
        },
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
      {
        name: "quality-1000-tokens",
        vars: {
          transcript: firstNTokens(learningVideoDataSet.transcript.value, 1000),
        },
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
      {
        name: "spam-350-tokens",
        vars: {
          transcript: firstNTokens(spamVideoDataset.transcript.value, 350),
        },
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
      {
        name: "spam-500-tokens",
        vars: {
          transcript: firstNTokens(spamVideoDataset.transcript.value, 500),
        },
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
      {
        name: "spam-1000-tokens",
        vars: {
          transcript: firstNTokens(spamVideoDataset.transcript.value, 1000),
        },
      },
      (output) => {
        return {
          pass: !output.recommend,
          score: output.recommend ? 0 : 1,
          reason: "",
        };
      }
    );
