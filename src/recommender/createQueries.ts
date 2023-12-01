import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { Prompt } from "./prompt";
import dotenv from "dotenv";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../twitter/getUserContext";
import { initTwitterAPI } from "../twitter/twitterAPI";
import { getUserTweetHistory } from "../twitter/getUserContext";
import zodToJsonSchema from "zod-to-json-schema";
import OpenAI from "openai";

// Getting this prompt right is critical to the success of the recommender.
// Run the test suite to compare different versions of the prompt.

const prompt1 = {
  prompt: `
# Instructions
- Analyze the provided list of tweets from a user's Twitter feed to identify topics, events and niches that interest the user.
- Then, generate YouTube search queries to find videos, interviews and podcasts that are deeply aligned with the user's professional or hobbyist interests.
- Each query should be formulated as a short array of 2-3 words, prioritizing specific technical terms the user has mentioned.
- Create 10 specific queries.
`.trim(),
  exampleTweets: tweetsToString(
    loadExampleTweetHistory("experilearning") || [],
    "experilearning"
  ),
  exampleQueries: [
    ["AI", "journalling", "assistant"],
    ["GPT-4V", "Vimium", "web browsing"],
    ["Three Body Problem", "e/acc", "science fiction"],
    ["Government", "AI", "integration"],
    ["LLM", "citation", "verification"],
    ["YouTube", "recommender", "system"],
    ["music", "creation", "AI"],
    ["Dominic Cummings", "interview", "government reform"],
    ["AI", "Text-to-speech", "integration"],
    ["e/acc", "meetup", "organization"],
  ],
};

const prompt2 = {
  prompt: prompt1.prompt,
  exampleTweets:
    "there's going to be a resurgence in RSS reader style internet consumption once LLM costs drop to the point where you can pre-filter blogs, twitter, subreddits etc using your personalised content recommendation agent",
  exampleQueries: [["RSS Reader", "LLM"]],
};

const prompt3 = {
  prompt: prompt1.prompt,
  exampleTweets: tweetsToString(
    loadExampleTweetHistory("corbtt") || [],
    "corbtt"
  ),
  exampleQueries: [
    ["OpenHermes", "ChatBot", "Arena"],
    ["GPT-4", "Turbo", "benchmarking"],
    ["AGI", "economic", "value"],
    ["Emmett Shear", "OpenAI", "CEO"],
    ["SAM Altman", "OpenAI", "departure"],
    ["Microsoft", "Orca 2", "Evals"],
    ["Language model", "evaluations"],
    ["OpenAI", "history", "Sam Altman"],
    ["AI", "decentralization"],
  ],
};

const prompts = [prompt1, prompt2, prompt3];

export const createYouTubeSearchQueriesPrompts: ChatCompletionMessageParam[][] =
  prompts.map((prompt) => [
    {
      role: "system",
      content: prompt.prompt,
    },
    {
      role: "user",
      content: `
My history of Tweets:
${prompt.exampleTweets}
`.trim(),
    },
    {
      role: "assistant",
      content: null,
      function_call: {
        name: "createYouTubeSearchQueries",
        arguments: JSON.stringify({
          queries: prompt.exampleQueries,
        } satisfies z.infer<typeof outputSchema>),
      },
    },
    {
      role: "user",
      content: `
My history of Tweets:
{{ tweets }}`,
    },
  ]);

const inputSchema = z.object({
  tweets: z.string(),
});

export type CreateQueriesInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  queries: z.array(z.array(z.string())),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "createYouTubeSearchQueries",
  description:
    "Create YouTube search queries based on the user's recent tweets.",
  parameters: zodToJsonSchema(outputSchema),
};

export const createYouTubeSearchQueries = new Prompt({
  prompt: createYouTubeSearchQueriesPrompts[2],
  model: "gpt-4",
  inputSchema,
  function: {
    schema: outputSchema,
    function: functionCall,
  },
});

if (require.main === module) {
  (async () => {
    dotenv.config();
    const user = process.argv[2] || "experilearning";
    const tweets =
      loadExampleTweetHistory(user) ||
      (await (async () => {
        const { api, bridge } = initTwitterAPI();
        const tweets = await getUserTweetHistory(api, user);
        bridge.close();
        return tweets;
      })());
    const tweetsStr = tweetsToString(tweets, user);
    const results = await createYouTubeSearchQueries.run({
      promptVars: {
        tweets: tweetsStr,
      },
    });
    console.log(results);
  })();
}
