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
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";

export const CREATE_YOUTUBE_SEARCH_QUERIES = "Create Queries";

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
        "Create YouTube video search queries based on the user's recent tweets.",
      prompts: [withJamesExamplePrompt, withKyleExamplePrompt],
      model: "gpt-4",
      input: createQueriesInputSchema,
      output: createQueriesOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    tweets: Tweet[];
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    const promptVariables: CreateQueriesInput = {
      user: args.user,
      tweets: tweetsToString({ tweets: args.tweets, user: args.user }),
    };
    const candidatePrompt = this.chooseCandidatePrompt(promptVariables);
    return await openpipe.functionCall({
      function: {
        name: this.name,
        description: this.description,
        input: this.input!,
        output: this.output!,
      },
      vars: promptVariables,
      prompt: candidatePrompt,
      body: {
        max_tokens: this.max_tokens,
        temperature: this.temperature,
        model: this.model,
        stream: false,
      },
      openPipeRequestTags: args.openPipeRequestTags
        ? {
            ...args.openPipeRequestTags,
            promptName: formatPromptName(this.name, candidatePrompt.name),
          }
        : undefined,
      enableOpenPipeLogging: args.enableOpenPipeLogging,
    });
  }
}

export const createYouTubeSearchQueries = () =>
  new CreateYouTubeSearchQueries()
    .withTest({
      name: "experilearning",
      onlyTestMainPrompt: true,
      vars: {
        user: "experilearning",
        tweets: experilearningTweetsDataset.tweets.value,
      },
    })
    .withTest({
      name: "corbtt",
      onlyTestMainPrompt: true,
      vars: {
        user: "corbtt",
        tweets: corbttTweetsDataset.tweets.value,
      },
    });
