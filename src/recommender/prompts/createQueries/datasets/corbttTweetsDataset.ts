import { ExampleDataSet } from "prompt-iteration-assistant";
import { createQueriesInputSchema } from "../schemas/createQueriesInputSchema";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../../../../twitter/getUserContext";

export const corbttTweetsDataset: ExampleDataSet<
  typeof createQueriesInputSchema
> = {
  tweets: {
    name: "corbtt tweets",
    value: tweetsToString({
      tweets: loadExampleTweetHistory("corbtt") || [],
      user: "corbtt",
    }),
  },
  user: {
    name: "corbtt",
    value: "corbtt",
  },
};
