import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { Prompt } from "./prompt";
import dotenv from "dotenv";

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
You are a YouTube video recommendation system that recommends videos to users based on their interests.
You are given some information about the user.
You should think of some YouTube search queries to run to find videos to recommend to the user.
Please return a list of 3 search queries.

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
  model: "gpt-3.5-turbo",
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
