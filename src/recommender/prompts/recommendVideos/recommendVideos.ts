import {
  RecommendVideosInput,
  recommendVideosInputSchema,
} from "./schemas/recommendVideosInputSchema";
import { Prompt } from "prompt-iteration-assistant";
import { recommendVideosOutputSchema } from "./schemas/recommendVideosOutputSchema";
import { mainPrompt } from "./prompts/withExample";
import _ from "lodash";
import { tweetsToString } from "../../../twitter/getUserContext";
import { Tweet } from "../../../twitter/schemas";
import { searchResultsToString } from "../../../youtube/formatting";
import { SearchResult } from "../../../youtube/search";
import { openpipe } from "../../../openpipe/openpipe";
import {
  elonAndRemNote,
  elonAndRemNoteSearchResults,
} from "./datasets/elonAndRemNote";

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
    user: string;
    tweets: Tweet[];
    results: SearchResult[];
    query: string;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: RecommendVideosInput = {
      query: args.query,
      results: searchResultsToString(args.results),
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };
    const { recommendedVideos } = await openpipe.functionCall({
      prompt: this.prompts[0],
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
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
    return _.sortBy(recommendedVideos, [(x) => x.relevance, "desc"]).map(
      ({ id, relevance }) => ({
        result: args.results[id],
        relevance,
      })
    );
  }
}

export const DEFAULT_RELEVANCE_THRESHOLD = 0.65;

export const recommendVideos = () => {
  return new RecommendVideos().withTest(
    "mix of relevant and irrelevant videos",
    {
      query: elonAndRemNote.query.value,
      results: elonAndRemNote.results.value,
      tweets: elonAndRemNote.tweets.value,
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
