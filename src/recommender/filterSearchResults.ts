import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { SearchResult } from "../youtube/search";

export const filterSearchResultsPrompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
`.trim(),
  },
  {
    role: "user",
    content: `
{{ searchResults }}
`.trim(),
  },
];

const filterSearchResultsSchema = z.object({
  filteredResults: z.array(z.string()),
});

export const filterSearchResultsFunction: ChatCompletionMessage.FunctionCall = {
  name: "filterSearchResults",
  arguments: JSON.stringify(zodToJsonSchema(filterSearchResultsSchema)),
};

export interface FilterSearchResultsVars {
  results: SearchResult[];
}

export async function filterSearchResults(
  args: FilterSearchResultsVars
): Promise<SearchResult[]> {
  return [];
}
