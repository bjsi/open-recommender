import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { SearchResult } from "../youtube/search";
import { Prompt } from "./prompt";
import OpenAI from "openai";
import { exampleSearchResults1 } from "./tests/exampleData";
import dotenv from "dotenv";

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
You are a YouTube video recommendation system that recommends videos to users based on their interests.
You are given some YouTube search results.
You must decide which videos to recommend to the user.

User Context: {{ userContext }}
`.trim(),
  },
  {
    role: "user",
    content: `
Query: {{ query }}

{{ searchResults }}
`.trim(),
  },
];

export const searchResultsToString = (results: SearchResult[]) => {
  return JSON.stringify(
    results.map((r, idx) => ({
      id: idx,
      title: r.title,
      description: r.description.slice(0, 50),
      channel: r.channel,
      views: r.view_count,
      rating: r.average_rating,
    })),
    null,
    2
  );
};

const inputSchema = z.object({
  results: z.string(),
  userContext: z.string(),
});

export type FilterSearchResultsInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  // array of ids
  filteredSearchResultIds: z.array(z.number()),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "filterSearchResults",
  description:
    "Filter search results based on user context to decide which videos to recommend.",
  parameters: zodToJsonSchema(outputSchema),
};

export const filterSearchResults = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-3.5-turbo",
  inputSchema,
});

if (require.main === module) {
  dotenv.config();
  filterSearchResults
    .run(
      {
        results: searchResultsToString(exampleSearchResults1),
        userContext:
          "The user is interested in learning more about RemNote's flashcard home project.",
      },
      true
    )
    .then(({ filteredSearchResultIds }) => {
      console.log(
        JSON.stringify(
          filteredSearchResultIds.map((id) => exampleSearchResults1[id]),
          null,
          2
        )
      );
    });
}
