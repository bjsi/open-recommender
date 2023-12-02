import { tokenize } from "../tokenize";
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "./textSplitter";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../twitter/getUserContext";
import { z } from "zod";
import { ChatCompletionMessageParam } from "openai/resources";
import zodToJsonSchema from "zod-to-json-schema";
import OpenAI from "openai";
import { Prompt } from "./prompt";

// Not sure if I'll use this approach

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
- You are a YouTube video recommendation system that recommends videos to users based on their interests.
- You are given a user's tweet history.
- Your task is to infer the user's interests from their Tweet history and brainstorm ideas for videos to recommend to them.
- You should try to come up with quite specific ideas that are tailored to the user's interests.
- You should try to come up with ideas that combine the user's interests in interesting ways.
`.trim(),
  },
  {
    role: "user",
    content: `
My Twitter username is {{ user }}.
Here is my tweet history:
{{ tweetHistory  }}
`.trim(),
  },
];

const inputSchema = z.object({
  tweetHistory: z.string(),
  user: z.string(),
});

export type InferInterestsInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  reasoning: z.string(),
  recommend: z.boolean(),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "inferInterests",
  description: "Infer the user's interests from their Tweet history.",
  parameters: zodToJsonSchema(outputSchema),
};

export const splitTweetHistory = async (text: string) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: 3500,
    chunkOverlap: 300,
    lengthFunction: async (text) => (await tokenize(text)).length,
    separators: ["---"],
  }).splitText(text);
  return parts;
};

export const inferInterests = new Prompt({
  function: {
    schema: outputSchema,
    function: functionCall,
  },
  prompt: prompt,
  model: "gpt-4",
  inputSchema: inputSchema,
});

if (require.main === module) {
  (async () => {
    dotenv.config();
    const user = process.argv[2] || "experilearning";
    const tweets = loadExampleTweetHistory(user);
    if (!tweets) {
      throw new Error("No tweet history found");
    }
    const tweetsStr = tweetsToString({ tweets, user });
    const parts = await splitTweetHistory(tweetsStr);
    for (const part of parts) {
      const res = await inferInterests.run({
        tweetHistory: part,
        user: user,
      });
      console.log(res);
    }
  })();
}
