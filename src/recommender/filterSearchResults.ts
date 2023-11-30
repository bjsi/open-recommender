import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { SearchResult } from "../youtube/search";
import { Prompt } from "./prompt";
import OpenAI from "openai";
import { remnoteFlashcardsSearchResults } from "./tests/exampleData";
import dotenv from "dotenv";

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
- You are a YouTube video recommender system choosing which videos to recommend to a user.
- You should not recommend videos that are not relevant to the user.
- Output an array of video IDs in order of relevance.
`.trim(),
  },
  {
    role: "user",
    content: `
Here are the kind of videos I'm interested in:
{{ queries }}
Search results:
{{ results }}
`.trim(),
  },
];

const inputSchema = z.object({
  results: z.string(),
  queries: z.string().array(),
});

export type FilterSearchResultsInputVars = z.infer<typeof inputSchema>;

export const searchResultsToString = (results: SearchResult[]) => {
  return results
    .map((r, idx) =>
      `
ID: ${idx}
Title: ${r.title}
Channel: ${r.channel}
Views: ${r.view_count}
Chapters:
${r.chapters?.map((c, idx) => idx + 1 + ". " + c.title).join("\n")}
`.trim()
    )
    .join("\n---\n");
};

const outputSchema = z.object({
  // array of ids
  recommendedVideos: z.array(z.number()),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "recommendVideos",
  description: "Recommend relevant videos to the user",
  parameters: zodToJsonSchema(outputSchema),
};

export const filterSearchResults = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-4-1106-preview",
  inputSchema,
});

if (require.main === module) {
  (async () => {
    dotenv.config();
    const searchResults = searchResultsToString(remnoteFlashcardsSearchResults);
    const { recommendedVideos } = await filterSearchResults.run({
      promptVars: {
        results: searchResults,
        queries: ["remnote flashcard home feature"],
      },
      verbose: true,
    });
    console.log(
      recommendedVideos.map((id) => remnoteFlashcardsSearchResults[id])
    );
  })();
}
