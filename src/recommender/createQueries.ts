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

const sysMessages = [
  // podcasts
  "Analyze the provided list of tweets from a user's Twitter feed to identify specific interests, subtopics, and technical terms, with a focus on topics that would lend themselves well to podcast formats. Then, generate YouTube search queries to find podcasts that align with these interests, combining them in a way that would likely yield engaging and in-depth podcast content. Make sure to include keywords in the queries that are specific to podcasts, such as 'podcast', 'interview', or 'discussion', alongside the identified interests and technical terms. Aim to create a variety of specific queries that target both video and podcast content related to the user's interests.",
  // videos
  "Examine the provided list of tweets from a user's Twitter feed and identify specific interests, subtopics, and especially any technical terms or industry jargon mentioned. Focus on these technical terms when creatively combining different interests to generate YouTube search queries. These queries should be crafted to find videos that are deeply aligned with the user's professional or hobbyist interests, using the technical terms to pinpoint content that is both directly related and uniquely insightful. Generate ten specific search queries, aiming for precision in content relevance.",
  // podcasts, interviews, and videos
  "Analyze the provided list of tweets from a user's Twitter feed to identify specific topics, events and niches that interest the user. " +
    "Then, generate YouTube search queries to find videos, interviews and podcasts that align with are deeply aligned with the user's professional or hobbyist interests. " +
    "Aim to create 10 specific queries. " +
    "The queries should be written as a collection of keywords as opposed to full sentences.",
];

export const createYouTubeSearchQueriesPrompts: ChatCompletionMessageParam[][] =
  sysMessages.map((sysMessage) => [
    {
      role: "system",
      content: sysMessage,
    },
    {
      role: "user",
      content: "{{ tweets }}",
    },
  ]);

const inputSchema = z.object({
  tweets: z.string(),
});

export type CreateQueriesInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  queries: z.array(z.string()),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "createYouTubeSearchQueries",
  description:
    "Create YouTube search queries based on the user's recent tweets.",
  parameters: zodToJsonSchema(outputSchema),
};

export const createYouTubeSearchQueries = new Prompt({
  prompt: createYouTubeSearchQueriesPrompts[2],
  model: "gpt-4-1106-preview",
  inputSchema,
  function: {
    schema: outputSchema,
    function: functionCall,
  },
});

if (require.main === module) {
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
  createYouTubeSearchQueries
    .run({
      promptVars: {
        tweets: tweetsStr,
      },
    })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
}
