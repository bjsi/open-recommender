import { Prompt } from "prompt-iteration-assistant";
import {
  RerankClipsInput,
  rerankClipsInputSchema,
} from "./schemas/rerankClipsInputSchema";
import { rerankClipsOutputSchema } from "./schemas/rerankClipsOutputSchema";
import { zeroShotPrompt } from "./prompts/withExample";
import { Tweet } from "../../../twitter/schemas";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import _, { uniq } from "remeda";
import { TranscriptClip } from "../recommendClips/helpers/transcriptClip";
import { searchChunkAndRank } from "../../dialogs/searchAndChunk";
import { advancedRagDataset } from "./datasets/advancedRagDataset";
import { RequestTagsWithoutName } from "../../../openpipe/requestTags";
import { transcriptClipsToString } from "./helpers/transcriptClipsToString";
import { zeroShotPromptWithUserProfile } from "./prompts/withProfileSummary";

export const RERANK_CLIPS = "Rerank Clips";

/**
 * To find the best video clips to show to the user, we use a re-ranking prompt loosely based on https://github.com/sunnweiwei/RankGPT.
 * To get around context length limitations in cases where there are many clips, we use a sliding window approach.
 * In each call we compare and order `windowSize` clips. The lowest ranked clip is discarded leaving us with `windowSize-1` clips
 */
export class RerankClips extends Prompt<
  typeof rerankClipsInputSchema,
  typeof rerankClipsOutputSchema
> {
  windowSize: number;
  numToDiscard: number;
  constructor(args: { windowSize: number; numToDiscard: number }) {
    super({
      name: RERANK_CLIPS,
      description:
        "Order YouTube video clips based on their relevance to the user's interests.",
      prompts: [zeroShotPromptWithUserProfile, zeroShotPrompt],
      model: "gpt-4",
      input: rerankClipsInputSchema,
      output: rerankClipsOutputSchema,
      exampleData: [advancedRagDataset],
    });
    this.windowSize = args.windowSize;
    this.numToDiscard = args.numToDiscard;
  }

  async execute(args: {
    user: string;
    tweets: Tweet[];
    clips: TranscriptClip[];
    profile: string;
    enableOpenPipeLogging?: boolean;
    openPipeRequestTags?: RequestTagsWithoutName;
  }) {
    const callApi = async (windowClips: TranscriptClip[]) => {
      const promptVariables: RerankClipsInput = {
        tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
        clips: transcriptClipsToString(windowClips),
        profile: args.profile,
      };
      const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
      const res = await openpipe.functionCall({
        function: {
          name: this.name,
          description: this.description,
          input: this.input!,
          output: this.output!,
        },
        vars: promptVariables,
        prompt: this.prompts[0],
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
        openPipeRequestTags: args.openPipeRequestTags
          ? { ...args.openPipeRequestTags, promptName: candidatePrompt.name }
          : undefined,
        enableOpenPipeLogging: args.enableOpenPipeLogging,
      });
      return (res?.orderedClipIds || []).map((id) => windowClips[id]);
    };

    if (args.clips.length === 0) {
      return [];
    } else if (args.clips.length === 1) {
      return args.clips;
    } else {
      let topClips: TranscriptClip[] = [];
      const initialWindow = args.clips.slice(0, this.windowSize);
      // initial rank
      const orderedClips = await callApi(initialWindow);
      // remove numToDiscard clips
      topClips = orderedClips.slice(0, this.windowSize - this.numToDiscard);
      // rank all
      for (let i = this.windowSize; i < args.clips.length; i++) {
        const window = topClips.concat(args.clips[i]);
        const orderedWindow = await callApi(window);
        // discard the bottom ranked clip
        topClips = orderedWindow.slice(0, this.windowSize - 1);
      }
      return uniq(topClips);
    }
  }
}

export const rerankClips = (
  args: {
    windowSize: number;
    numToDiscard: number;
  } = { windowSize: 4, numToDiscard: 1 }
) =>
  new RerankClips(args)
    .withCommand({
      name: "search chunk and rank",
      async action() {
        await searchChunkAndRank();
      },
    })
    .withTest(
      {
        name: "advanced rag",
        vars: {
          clips: advancedRagDataset.clips.value,
          tweets: advancedRagDataset.tweets.value,
          profile: advancedRagDataset.profile.value,
        },
      },
      (output) => {
        return {
          pass: output.orderedClipIds.length === 3,
          reason: `Expected 3 clips, got ${output.orderedClipIds.length}`,
          score: output.orderedClipIds.length === 3 ? 1 : 0,
        };
      },
      (output) => {
        return {
          pass: output.orderedClipIds[0] === 2,
          reason: `Expected clip 2 to be first, got ${output.orderedClipIds[0]}`,
          score: output.orderedClipIds[0] === 2 ? 1 : 0,
        };
      }
    );
