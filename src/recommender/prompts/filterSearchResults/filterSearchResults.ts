import { filterSearchResultsInputSchema } from "./schemas/filterSearchResultsInputSchema";
import { Prompt } from "prompt-iteration-assistant";
import { filterSearchResultsOutputSchema } from "./schemas/filterSearchResultsOutputSchema";
import { mainPrompt } from "./prompts/withExample";

export const RECOMMEND_VIDEOS = "Recommend Videos";

export const filterSearchResults = () =>
  new Prompt<
    typeof filterSearchResultsInputSchema,
    typeof filterSearchResultsOutputSchema
  >({
    state: {},
    name: RECOMMEND_VIDEOS,
    prompts: [mainPrompt],
    model: "gpt-4",
    input: filterSearchResultsInputSchema,
    output: filterSearchResultsOutputSchema,
  });

// if (require.main === module) {
//   (async () => {
//     dotenv.config();
//     const searchResults = ``.trim();
//     const tweets = "".trim();
//     const { recommendedVideos } = await filterSearchResults.run({
//       promptVars: {
//         query: "AI journalling assistant",
//         results: searchResults,
//         tweets,
//       },
//       verbose: true,
//     });
//     console.log(
//       recommendedVideos.map((video) => searchResults.split("---")[video.id])
//     );
//   })();
// }
