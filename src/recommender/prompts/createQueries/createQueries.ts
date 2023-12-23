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
import { experilearningTweetsDataset } from "./datasets/experilearningTweetsDataset";
import { corbttTweetsDataset } from "./datasets/corbttTweetsDataset";

export const CREATE_YOUTUBE_SEARCH_QUERIES = "Create YouTube Search Queries";

/**
 * We use GPT to create YouTube search queries based on the user's tweets.
 * Getting this prompt right is critical to the success of the recommender.
 */
export class CreateYouTubeSearchQueries extends Prompt<
  typeof createQueriesInputSchema,
  typeof createQueriesOutputSchema
> {
  constructor() {
    super({
      name: CREATE_YOUTUBE_SEARCH_QUERIES,
      description:
        "Create YouTube search queries based on the user's recent tweets.",
      prompts: [withJamesExamplePrompt, withKyleExamplePrompt],
      model: "gpt-4",
      input: createQueriesInputSchema,
      output: createQueriesOutputSchema,
      exampleData: [],
      max_tokens: 600,
    });
  }
  override chooseCandidatePrompt = (vars: Partial<CreateQueriesInput>) => {
    if (vars.user === "experilearning") {
      return withKyleExamplePrompt;
    } else {
      return withJamesExamplePrompt;
    }
  };

  async execute(args: {
    user: string;
    tweets: Tweet[];
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesInput = {
      user: args.user,
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };
    const prompt = this.chooseCandidatePrompt(promptVariables);
    return await openpipe.functionCall({
      function: {
        name: this.name,
        description: this.description,
        input: this.input!,
        output: this.output!,
      },
      vars: promptVariables,
      prompt,
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

export const createYouTubeSearchQueries = () =>
  new CreateYouTubeSearchQueries()
    .withTest("experilearning", {
      user: "experilearning",
      tweets: experilearningTweetsDataset.tweets.value,
    })
    .withTest("corbtt", {
      user: "corbtt",
      tweets: corbttTweetsDataset.tweets.value,
    });
