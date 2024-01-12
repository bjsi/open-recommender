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
  RequestTagsLatest,
  formatPromptName,
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
    profile: string;
    openPipeRequestTags?: Omit<RequestTagsLatest, "promptName">;
    enableOpenPipeLogging?: boolean;
  }) {
    // take a max of 2000 transcript tokens, depending on the length of the prompt + profile
    const maxTranscriptTokens =
      8192 -
      // for output
      400 -
      (
        await this.calculateCost({
          transcript: "",
          profile: args.profile,
          videoTitle: args.title,
        })
      ).total;
    const transcript = firstNTokens(
      transcriptCuesToVtt(args.transcript),
      Math.min(maxTranscriptTokens, 2000)
    );

    const promptVariables: AppraiseTranscriptInput = {
      transcript,
      videoTitle: args.title,
      profile: args.profile,
    };
    const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
    const res = await openpipe.functionCall({
      function: {
        input: this.input!,
        output: this.output!,
        name: this.name,
        description: this.description,
      },
      vars: promptVariables,
      prompt: candidatePrompt,
      body: {
        max_tokens: this.max_tokens,
        temperature: this.temperature,
        model: this.model,
      },
      openPipeRequestTags: args.openPipeRequestTags
        ? {
            ...args.openPipeRequestTags,
            promptName: formatPromptName(this.name, candidatePrompt.name),
          }
        : undefined,
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
    return (
      res || {
        recommend: false,
        reasoning: "No response from OpenAI",
      }
    );
  }
}

export const appraiseTranscript = () =>
  new AppraiseTranscriptPrompt()
    .withTest(
      {
        name: "quality-250-tokens",
        vars: {
          transcript: firstNTokens(learningVideoDataSet.transcript.value, 250),
          profile: learningVideoDataSet.profile.value,
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
          profile: learningVideoDataSet.profile.value,
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
          profile: learningVideoDataSet.profile.value,
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
          profile: learningVideoDataSet.profile.value,
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
          profile: learningVideoDataSet.profile.value,
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
          profile: learningVideoDataSet.profile.value,
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
