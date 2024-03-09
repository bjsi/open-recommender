import { Prompt } from "prompt-iteration-assistant";
import { zeroShot } from "./prompts/zeroShot";
import { RequestTagsWithoutName } from "../../../openpipe/requestTags";
import { Tweet, TwitterUser } from "shared/src/manual/Tweet";
import { tweetsToString } from "../../../twitter/getUserContext";
import {
  experilearningDataset,
  experilearningTweets,
  experilearningTwitterUser,
} from "./datasets/experilearning";
import { RecursiveCharacterTextSplitter } from "../../textSplitter";
import {
  RecursiveTwitterSummarizerInput,
  recursiveTwitterSummarizerInputSchema,
} from "./schemas/recursiveTwitterSummarizerInputSchema";
import { tokenize } from "../../../tokenize";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { DefaultRun, Run } from "modelfusion";
import {
  calculateCost,
  OpenAICostCalculator,
} from "@modelfusion/cost-calculator";

export const SUMMARIZE_TWEETS = "Summarize Data";

/**
 * Recursively summarize a user's tweets into a kind of user profile.
 */
export class RecursiveTwitterSummarizer extends Prompt<
  typeof recursiveTwitterSummarizerInputSchema,
  z.ZodString
> {
  constructor() {
    super({
      name: SUMMARIZE_TWEETS,
      description: "Summarize the user's data into a user profile.",
      prompts: [zeroShot],
      model: "gpt-4",
      input: recursiveTwitterSummarizerInputSchema,
      exampleData: [],
    });
  }

  async execute(args: {
    user: TwitterUser;
    tweets: Tweet[];
    openPipeRequestTags?: RequestTagsWithoutName;
    enableOpenPipeLogging?: boolean;
    run?: Run;
  }) {
    if (args.tweets.length === 0) {
      return undefined;
    }
    const bio = args.tweets[0].user.rawDescription;

    const maxTokens =
      8192 -
      // for output
      1500 -
      (
        await this.calculateCost({
          tweets: "",
          bio,
          user: args.user.displayname,
        })
      ).total;

    const callApi = async (tweetsOrSummaries: string) => {
      const promptVariables: RecursiveTwitterSummarizerInput = {
        tweets: tweetsOrSummaries,
        bio,
        user: args.user.displayname,
      };
      const res = await this.run({
        stream: false,
        promptVariables,
        // @ts-ignore
        run: args.run,
      });
      return res || "";
    };

    const parts = await new RecursiveCharacterTextSplitter({
      separators: ["---"],
      chunkSize: maxTokens,
    }).splitText(
      tweetsToString({ tweets: args.tweets, inFeedOfUser: args.user })
    );

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
      const res = await callApi(
        tweetsToString({ tweets, inFeedOfUser: args.user })
      );
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
        (await tokenize(summaries.join(" "))).length <= 2200
      ) {
        return summaries.join(" ");
      } else {
        console.log("summaries");
        console.log(summaries);
        const text = summaries.join("\n---\n");
        const parts = await new RecursiveCharacterTextSplitter({
          separators: ["---"],
          chunkSize: maxTokens,
          chunkOverlap: 100,
        }).splitText(text);
        return await summarizeRecursively(
          await Promise.all(parts.map(callApi))
        );
      }
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
    const p = path.resolve("packages/cli/.env");
    dotenv.config({ path: p });
    console.log("SUMMARIZE TWEETS");
    console.time("SUMMARIZE TWEETS");
    const run = new DefaultRun();
    const sum = await recursivelySummarizeTweets().execute({
      user: experilearningTwitterUser,
      tweets: experilearningTweets.slice(0, 20),
      run,
    });
    const cost = await calculateCost({
      calls: run.getSuccessfulModelCalls(),
      costCalculators: [new OpenAICostCalculator()],
    });
    console.log("cost", cost.formatAsDollarAmount({ decimals: 2 }));
    console.timeEnd("SUMMARIZE TWEETS");
    console.log("FINAL SUMMARY");
    console.log(sum);
  })();
}
