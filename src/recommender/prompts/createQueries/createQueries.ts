import { Prompt } from "prompt-iteration-assistant";
import { withJamesExamplePrompt } from "./prompts/withJamesExamplePrompt";
import { withKyleExamplePrompt } from "./prompts/withKyleExamplePrompt";
import { createQueriesOutputSchema } from "./schemas/createQueriesOutputSchema";
import { createQueriesInputSchema } from "./schemas/createQueriesInputSchema";

export const CREATE_YOUTUBE_SEARCH_QUERIES = "Create YouTube Search Queries";

/**
 * Getting this prompt right is critical to the success of the recommender.
 * Run the test suite to compare different versions of the prompt.
 */
export const createYouTubeSearchQueries = (user: string) =>
  new Prompt<typeof createQueriesInputSchema, typeof createQueriesOutputSchema>(
    {
      state: {},
      name: CREATE_YOUTUBE_SEARCH_QUERIES,
      description:
        "Create YouTube search queries based on the user's recent tweets.",
      prompts: [
        user === "experilearning"
          ? withKyleExamplePrompt
          : withJamesExamplePrompt,
        user === "experilearning"
          ? withJamesExamplePrompt
          : withKyleExamplePrompt,
      ],
      model: "gpt-4",
      input: createQueriesInputSchema,
      output: createQueriesOutputSchema,
    }
  );

// if (require.main === module) {
//   (async () => {
//     dotenv.config();
//     const user = process.argv[2] || "experilearning";
//     const tweets =
//       loadExampleTweetHistory(user) ||
//       (await (async () => {
//         const { api, bridge } = initTwitterAPI();
//         const tweets = await getUserTweetHistory(api, user);
//         bridge.close();
//         return tweets;
//       })());
//     const tweetsAsStr = tweets.map((tweet, idx) =>
//       tweetToString({
//         data: tweet,
//         user,
//         id: idx,
//       })
//     );
//     const results = await createYouTubeSearchQueries(user).run({
//       promptVars: {
//         tweets: tweetsAsStr.join("\n---\n"),
//       },
//     });

//     for (const result of results.queries) {
//       console.log("---");
//       console.log(result.query);
//       console.log(result.tweetIDs);
//       console.log(result.tweetIDs.map((id) => tweetsAsStr[id]));
//     }
//   })();
// }
