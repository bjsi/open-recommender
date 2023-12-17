import {
  FilterSearchResultsInput,
  filterSearchResultsInputSchema,
} from "./schemas/filterSearchResultsInputSchema";
import { Prompt } from "prompt-iteration-assistant";
import {
  FilterSearchResultsOutput,
  filterSearchResultsOutputSchema,
} from "./schemas/filterSearchResultsOutputSchema";
import { mainPrompt } from "./prompts/withExample";
import _ from "lodash";
import { tweetsToString } from "../../../twitter/getUserContext";
import { Tweet } from "../../../twitter/schemas";
import { searchResultsToString } from "../../../youtube/formatting";
import { SearchResult } from "../../../youtube/search";
import { openpipe } from "../../../openpipe/openpipe";

export const RECOMMEND_VIDEOS = "Recommend Videos";

class RecommendVideos extends Prompt<
  typeof filterSearchResultsInputSchema,
  typeof filterSearchResultsOutputSchema
> {
  constructor() {
    super({
      name: RECOMMEND_VIDEOS,
      description:
        "Recommend relevant videos to the user based on their interests.",
      prompts: [mainPrompt],
      model: "gpt-4",
      input: filterSearchResultsInputSchema,
      output: filterSearchResultsOutputSchema,
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
    const promptVariables: FilterSearchResultsInput = {
      results: searchResultsToString(args.results),
      query: args.query,
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };

    let videos: FilterSearchResultsOutput["recommendedVideos"] = [];
    if (!args.enableOpenPipeLogging) {
      const { recommendedVideos } = await filterSearchResults().run({
        promptVariables,
        stream: false,
      });
      videos = recommendedVideos;
    } else {
      const { recommendedVideos } = await openpipe.function({
        prompt: this.prompts[0],
        input: this.input!,
        output: this.output!,
        vars: promptVariables,
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
        },
      });
      videos = recommendedVideos;
    }
    return _.sortBy(videos, [(x) => x.relevance, "desc"]).map(
      ({ id, relevance }) => ({
        result: args.results[id],
        relevance,
      })
    );
  }
}

export const filterSearchResults = () => new RecommendVideos();
