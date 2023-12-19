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

/**
 * We use GPT to create YouTube search queries based on the user's tweets.
 * Getting this prompt right is critical to the success of the recommender.
 * Run the test suite to compare different versions of the prompt.
 */
export class CreateYouTubeSearchQueries extends Prompt<
  typeof createQueriesInputSchema,
  typeof createQueriesOutputSchema
> {
  constructor(user: string) {
    super({
      name: CREATE_YOUTUBE_SEARCH_QUERIES,
      description:
        "Create YouTube search queries based on the user's recent tweets.",
      prompts: [
        user === "experilearning"
          ? withKyleExamplePrompt
          : withJamesExamplePrompt,
        user === "experilearning"
          ? withJamesExamplePrompt
          : withKyleExamplePrompt,
      ],
      model: "gpt-4",
      input: createQueriesInputSchema,
      output: createQueriesOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    tweets: Tweet[];
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesInput = {
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };
    return await openpipe.functionCall({
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
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
  }
}

export const createYouTubeSearchQueries = (user: string) =>
  new CreateYouTubeSearchQueries(user);
