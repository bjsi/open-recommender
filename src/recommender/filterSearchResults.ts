import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { SearchResult } from "../youtube/search";
import { Prompt } from "./prompt";

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

export const formatSearchResults = (results: SearchResult[]) => {
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

const outputSchema = z.object({
  // array of ids
  filteredResults: z.array(z.number()),
});

export const filterSearchResultsFunction: ChatCompletionMessage.FunctionCall = {
  name: "filterSearchResults",
  arguments: JSON.stringify(zodToJsonSchema(outputSchema)),
};

export interface FilterSearchResultsVars {
  results: SearchResult[];
}

export const filterSearchResults = new Prompt({
  function: {
    schema: outputSchema,
    function: filterSearchResultsFunction,
  },
  prompt: prompt,
  model: "gpt-3.5-turbo",
  inputSchema,
});
