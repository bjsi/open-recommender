import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { Prompt } from "./prompt";
import dotenv from "dotenv";

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
- You are a YouTube video recommendation system that recommends videos to users based on their interests.
- You should create 3 YouTube search queries to find relevant videos to recommend to the user based on their interests.
- Output the queries as a markdown list.

User Context: {{ userContext }}
`.trim(),
  },
];

export const parseCreateQueriesOutput = (output: string) => {
  const queries = output
    .split("\n")
    .map((query) =>
      query
        .trim()
        .replace(/^- /, "")
        .replace(/^\d+\. /, "")
        .replace(/\"/g, "")
    )
    .filter(Boolean);
  return queries;
};

const inputSchema = z.object({
  userContext: z.string(),
});

export type CreateQueriesInputVars = z.infer<typeof inputSchema>;

export const createYouTubeSearchQueries = new Prompt({
  prompt: prompt,
  model: "gpt-4-1106-preview",
  inputSchema,
});

if (require.main === module) {
  dotenv.config();
  const userContext =
    process.argv[2] ||
    "The user is interested in learning more about RemNote's flashcard home project.";
  createYouTubeSearchQueries
    .run({
      userContext,
    })
    .then((results) => {
      console.log(results);
    });
}
