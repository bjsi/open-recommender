import { ExampleDataSet } from "prompt-iteration-assistant";
import { CreateQueriesInput } from "../schemas/createQueriesInputSchema";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../../../../twitter/getUserContext";

export const corbttTweetsDataset: ExampleDataSet<CreateQueriesInput> = {
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
