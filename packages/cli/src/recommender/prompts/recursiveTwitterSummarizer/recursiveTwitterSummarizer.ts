import { Prompt } from "prompt-iteration-assistant";
import { zeroShot } from "./prompts/zeroShot";
import {
  RequestTagsWithoutName,
  formatPromptName,
} from "../../../openpipe/requestTags";
import { Tweet } from "../../../twitter/schemas";
import { tweetsToString } from "../../../twitter/getUserContext";
import { openpipe } from "../../../openpipe/openpipe";
import {
  experilearningDataset,
  experilearningTweets,
} from "./datasets/experilearning";
import { RecursiveCharacterTextSplitter } from "../../textSplitter";
import {
  RecursiveTwitterSummarizerInput,
  recursiveTwitterSummarizerInputSchema,
} from "./schemas/recursiveTwitterSummarizerInputSchema";
import { recursiveTwitterSummarizerOutputSchema } from "./schemas/recursiveTwitterSummarizerOutputSchema";
import { tokenize } from "../../../tokenize";

export const SUMMARIZE_TWEETS = "Summarize Tweets";

/**
 * Recursively summarize a user's tweets into a kind of user profile.
 */
export class RecursiveTwitterSummarizer extends Prompt<
  typeof recursiveTwitterSummarizerInputSchema,
  typeof recursiveTwitterSummarizerOutputSchema
> {
  constructor() {
    super({
      name: SUMMARIZE_TWEETS,
      description:
        "Extract a list of tweets that reveal the user's hobbyist and professional interests.",
      prompts: [zeroShot],
      model: "gpt-4",
      input: recursiveTwitterSummarizerInputSchema,
      output: recursiveTwitterSummarizerOutputSchema,
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
      return undefined;
    }
    const bio = args.tweets[0].user.rawDescription;

    const maxTokens =
      8192 -
      // for output
      1000 -
      (
        await this.calculateCost({
          tweets: "",
          bio,
          user: args.user,
        })
      ).total;

    const callApi = async (tweetsOrSummaries: string) => {
      const promptVariables: RecursiveTwitterSummarizerInput = {
        tweets: tweetsOrSummaries,
        bio,
        user: args.user,
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
      return res?.summary || "";
    };

    const parts = await new RecursiveCharacterTextSplitter({
      separators: ["---"],
      chunkSize: maxTokens,
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

    let summaries: string[] = [];
    for (const tweets of tweetChunks) {
      const res = await callApi(tweetsToString({ tweets, user: args.user }));
      summaries.push(res);
    }

    const summarizeRecursively = async (
      summaries: string[]
    ): Promise<string | undefined> => {
      summaries = summaries
        .filter((x) => x.trim().length > 0)
        .map((x) => x.replace(/\r?\n/g, " "));
      if (
        summaries.length <= 1 ||
        (await tokenize(summaries.reduce((a, b) => a + " " + b))).length <= 1200
      ) {
        return summaries.join(" ");
      }
      console.log("summaries");
      console.log(summaries);
      const text = summaries.join("\n---\n");
      const parts = await new RecursiveCharacterTextSplitter({
        separators: ["---"],
        chunkSize: maxTokens,
        chunkOverlap: 200,
      }).splitText(text);
      return await summarizeRecursively(await Promise.all(parts.map(callApi)));
    };

    const summary = await summarizeRecursively(summaries);
    return summary;
  }
}

export const recursivelySummarizeTweets = () =>
  new RecursiveTwitterSummarizer().withTest({
    name: "experilearning",
    vars: {
      bio: experilearningDataset.bio.value,
      user: experilearningDataset.user.value,
      tweets: experilearningDataset.tweets.value,
    },
  });

if (require.main === module) {
  (async () => {
    const sum = await recursivelySummarizeTweets().execute({
      user: "experilearning",
      tweets: experilearningTweets,
    });
    console.log("FINAL SUMMARY");
    console.log(sum);
  })();
}
