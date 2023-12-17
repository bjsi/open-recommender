import { Prompt } from "prompt-iteration-assistant";
import { withJamesExamplePrompt } from "./prompts/withJamesExamplePrompt";
import { withKyleExamplePrompt } from "./prompts/withKyleExamplePrompt";
import { createQueriesOutputSchema } from "./schemas/createQueriesOutputSchema";
import {
  CreateQueriesInput,
  createQueriesInputSchema,
} from "./schemas/createQueriesInputSchema";
import { tweetsToString } from "../../../twitter/getUserContext";
import { Tweet } from "../../../twitter/schemas";
import { openpipe } from "../../../openpipe/openpipe";

export const CREATE_YOUTUBE_SEARCH_QUERIES = "Create YouTube Search Queries";

class CreateYouTubeSearchQueries extends Prompt<
  typeof createQueriesInputSchema,
  typeof createQueriesOutputSchema
> {
  constructor() {
    super({
      name: CREATE_YOUTUBE_SEARCH_QUERIES,
      description:
        "Create YouTube search queries based on the user's recent tweets.",
      prompts: [withKyleExamplePrompt, withJamesExamplePrompt],
      model: "gpt-4",
      input: createQueriesInputSchema,
      output: createQueriesOutputSchema,
      exampleData: [],
    });
  }
  async execute(args: {
    user: string;
    tweets: Tweet[];
    verbose?: boolean;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesInput = {
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };

    if (!args.enableOpenPipeLogging) {
      return await this.run({
        promptVariables: promptVariables,
        stream: false,
      });
    } else {
      return await openpipe.function({
        input: this.input!,
        output: this.output!,
        vars: promptVariables,
        prompt: this.prompts[0],
        body: {
          max_tokens: this.max_tokens,
          temperature: this.temperature,
          model: this.model,
          stream: false,
        },
      });
    }
  }
}

/**
 * Getting this prompt right is critical to the success of the recommender.
 * Run the test suite to compare different versions of the prompt.
 */
export const createYouTubeSearchQueries = (user: string) =>
  new CreateYouTubeSearchQueries();
