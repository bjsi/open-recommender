import { Prompt } from "prompt-iteration-assistant";
import {
  FilterIrrelevantTweetsInput,
  filterIrrelevantTweetsInputSchema,
} from "./schemas/filterIrrelevantTweetsInputSchema";
import { filterIrrelevantTweetsOutputSchema } from "./schemas/filterIrrelevantTweetsOutputSchema";
import { zeroShot } from "./prompts/zeroShot";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../../openpipe/requestTags";
import { Tweet } from "shared/src/manual/Tweet";
import { tweetsToString } from "../../../../twitter/getUserContext";
import { openpipe } from "../../../../openpipe/openpipe";
import {
  experilearningDataset,
  experilearningTweets,
} from "./datasets/experilearning";
import { uniqBy } from "remeda";
import { RecursiveCharacterTextSplitter } from "../../../textSplitter";
import { pAll } from "../../../../pipeline/utils/pAll";

export const EXTRACT_RELEVANT_TWEETS = "Extract Relevant Tweets";

/**
 * Filter out irrelevant tweets (shitposts etc).
 * NOTE: Not working reliably yet.
 */
export class ExtractRelevantTweets extends Prompt<
  typeof filterIrrelevantTweetsInputSchema,
  typeof filterIrrelevantTweetsOutputSchema
> {
  constructor() {
    super({
      name: EXTRACT_RELEVANT_TWEETS,
      description: "Extract a list of relevant tweets.",
      prompts: [zeroShot],
      model: "gpt-4",
      input: filterIrrelevantTweetsInputSchema,
      output: filterIrrelevantTweetsOutputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: string;
    tweets: Tweet[];
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
  }) {
    if (args.tweets.length === 0) {
      return [];
    }

    const maxTokens =
      8192 -
      // for output
      500 -
      (
        await this.calculateCost({
          tweets: "",
        })
      ).total;

    const callApi = async (tweets: Tweet[]) => {
      const relevantTweets: Tweet[] = [];
      const promptVariables: FilterIrrelevantTweetsInput = {
        tweets: tweetsToString({ tweets, user: args.user }),
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
      relevantTweets.push(...(res?.tweetIDs || []).map((id) => tweets[id]));
      return relevantTweets;
    };

    const parts = await new RecursiveCharacterTextSplitter({
      separators: ["---"],
      chunkSize: maxTokens,
      chunkOverlap: 200,
    }).splitText(tweetsToString({ tweets: args.tweets, user: args.user }));

    // messy code to make sure each prompt gets filled with the
    // max number of tweets given the model's context limit.

    const tweetChunks: Tweet[][] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const tweetIdxs = part
        .split("---")
        .map(
          (x) =>
            x.match(/ID: ([0-9]+)/)?.[1] &&
            parseInt(x.match("ID: ([0-9]+)")![1])
        )
        .filter((x) => x != null) as number[];

      console.log(part);
      console.log("tweetIdxs");
      console.log(tweetIdxs);

      tweetChunks.push(tweetIdxs.map((idx) => args.tweets[idx]));
    }

    const relevantTweets: Tweet[] = (
      await pAll(
        tweetChunks.map((x) => () => callApi(x)),
        { concurrency: 15 }
      )
    ).flat();

    return uniqBy(relevantTweets, (x) => x.id);
  }
}

export const extractRelevantTweets = () =>
  new ExtractRelevantTweets().withTest({
    name: "experilearning",
    vars: {
      tweets: experilearningDataset.tweets.value,
    },
  });

if (require.main === module) {
  (async () => {
    const input = experilearningTweets.slice(0, 30);
    const tweets = await extractRelevantTweets().execute({
      user: "experilearning",
      tweets: input,
    });

    const rejectedTweets = input.filter(
      (x) => !tweets.map((x) => x.id).includes(x.id)
    );

    console.log("Rejected tweets");
    console.log(
      tweetsToString({
        tweets: rejectedTweets,
        user: "experilearning",
      })
    );
  })();
}
