import { ExampleDataSet } from "prompt-iteration-assistant";
import {
  tweetsToString,
  loadExampleTweetHistory,
} from "../../../../../twitter/getUserContext";
import { CreateQueriesInput } from "../schemas/createQueriesInputSchema";
import { experilearningTwitterUser } from "../../../recursiveTwitterSummarizer/datasets/experilearning";

export const experilearningTweetsDataset: ExampleDataSet<CreateQueriesInput> = {
  tweets: {
    name: "experilearning tweets",
    value: tweetsToString({
      tweets: (loadExampleTweetHistory("experilearning") || []).slice(0, 10),
      inFeedOfUser: experilearningTwitterUser,
    }),
  },
  user: {
    name: "experilearning",
    value: "experilearning",
  },
};
