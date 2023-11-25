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
- Which of the following videos would be most relevant to the user based on their interests.
- You should not recommend videos that are not relevant to the user.
- User's interests: {{ userContext }}
- Videos:
{{ searchResults }}
`.trim(),
  },
  {
    role: "user",
    content: `
`.trim(),
  },
];

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
    .join("\n\n");
};

const inputSchema = z.object({
  searchResults: z.string(),
  userContext: z.string(),
});

export type FilterSearchResultsInputVars = z.infer<typeof inputSchema>;

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
  dotenv.config();
  const searchResults = searchResultsToString(exampleSearchResults1);
  console.log(searchResults);
  filterSearchResults.run(
    {
      searchResults,
      //"The user is interested in learning more about RemNote's flashcard home project.",
      userContext: "The user is interested in space.",
    },
    true
  );
}
