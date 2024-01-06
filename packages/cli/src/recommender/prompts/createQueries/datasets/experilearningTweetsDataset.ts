import { ExampleDataSet } from "prompt-iteration-assistant";
import {
  tweetsToString,
  loadExampleTweetHistory,
} from "../../../../twitter/getUserContext";
import { CreateQueriesInput } from "../schemas/createQueriesInputSchema";

export const experilearningTweetsDataset: ExampleDataSet<CreateQueriesInput> = {
  tweets: {
    name: "experilearning tweets",
    value: tweetsToString({
      tweets: (loadExampleTweetHistory("experilearning") || []).slice(0, 10),
      user: "experilearning",
    }),
  },
  user: {
    name: "experilearning",
    value: "experilearning",
  },
};
