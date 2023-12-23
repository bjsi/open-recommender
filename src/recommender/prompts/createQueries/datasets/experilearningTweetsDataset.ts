import { ExampleDataSet } from "prompt-iteration-assistant";
import {
  tweetsToString,
  loadExampleTweetHistory,
} from "../../../../twitter/getUserContext";
import { createQueriesInputSchema } from "../schemas/createQueriesInputSchema";

export const experilearningTweetsDataset: ExampleDataSet<
  typeof createQueriesInputSchema
> = {
  tweets: {
    name: "experilearning tweets",
    value: tweetsToString({
      tweets: loadExampleTweetHistory("experilearning") || [],
      user: "experilearning",
    }),
  },
  user: {
    name: "experilearning",
    value: "experilearning",
  },
};
