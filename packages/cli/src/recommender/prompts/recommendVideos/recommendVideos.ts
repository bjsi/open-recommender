import {
  RecommendVideosInput,
  recommendVideosInputSchema,
} from "./schemas/recommendVideosInputSchema";
import { Prompt } from "prompt-iteration-assistant";
import { recommendVideosOutputSchema } from "./schemas/recommendVideosOutputSchema";
import { mainPrompt } from "./prompts/withExample";
import _ from "lodash";
import { tweetsToString } from "../../../twitter/getUserContext";
import { Tweet, TwitterUser } from "shared/src/manual/Tweet";
import { searchResultsToString } from "../../../youtube/formatting";
import { SearchResult } from "../../../youtube/search";
import { openpipe } from "../../../openpipe/openpipe";
import {
  elonAndRemNote,
  elonAndRemNoteSearchResults,
} from "./datasets/elonAndRemNote";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { sortBy } from "remeda";

export const RECOMMEND_VIDEOS = "Recommend Videos";

export class RecommendVideos extends Prompt<
  typeof recommendVideosInputSchema,
  typeof recommendVideosOutputSchema
> {
  constructor() {
    super({
      name: RECOMMEND_VIDEOS,
      description:
        "Recommend relevant videos to the user based on their interests.",
      prompts: [mainPrompt],
      model: "gpt-4",
      input: recommendVideosInputSchema,
      output: recommendVideosOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: TwitterUser;
    tweets: Tweet[];
    results: SearchResult[];
    query: string;
    enableOpenPipeLogging?: boolean;
    openPipeRequestTags?: RequestTagsWithoutName;
  }) {
    const promptVariables: RecommendVideosInput = {
      query: args.query,
      results: searchResultsToString(args.results),
      tweets: tweetsToString({ tweets: args.tweets, inFeedOfUser: args.user }),
    };
    const candidatePrompt = this.prompts[0];
    const res = await openpipe.functionCall({
      prompt: candidatePrompt,
      function: {
        name: this.name,
        description: this.description,
        input: this.input!,
        output: this.output!,
      },
      vars: promptVariables,
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
    return sortBy(res?.recommendedVideos || [], [
      (x) => x.relevance,
      "desc",
    ]).map(({ id, relevance }) => ({
      result: args.results[id],
      relevance,
    }));
  }
}

export const DEFAULT_RELEVANCE_THRESHOLD = 0.65;

export const recommendVideos = () => {
  return new RecommendVideos().withTest(
    {
      name: "elon-and-rem-note",
      vars: {
        query: elonAndRemNote.query.value,
        results: elonAndRemNote.results.value,
        tweets: elonAndRemNote.tweets.value,
      },
    },
    (output) => {
      const vids = output.recommendedVideos.map(
        (x) => elonAndRemNoteSearchResults[x.id]
      );
      return {
        pass: true,
        reason: "",
        score: 1,
      };
    }
  );
};
