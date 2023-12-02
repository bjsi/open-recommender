import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { SearchResult } from "../youtube/search";
import { Prompt } from "./prompt";
import OpenAI from "openai";
import dotenv from "dotenv";

const prompt: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `
# Instructions
- You are a YouTube video recommender system choosing which videos to recommend to a user based on their tweet history and search query.
- You should assess the relevance of each video by looking at the search query and the user's tweet history.
- Output an array of video IDs with relevancy scores between 0 and 1.
`.trim(),
  },
  {
    role: "user",
    content: `
# Twitter
ID: 48
tweet: @experilearning (2023-11-07)
Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far
- take each paragraph
- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)
- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT
- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you
It feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.
reply: @experilearning (2023-11-13)
Exporting and pre-processing to get RAG working is extremely tedious. My journals are messy hierarchies of markdown bullets of varying lengths with topics spread all over the page. I threw GPT-4 at the problem and rewrote, chunked, and attached metadata for all of the journals 🤷‍♂️
---
ID: 51
@experilearning (2023-11-13)
Hoping that the OpenAI retrieval API will eventually just be able to pick a RAG strategy and do all of the preprocessing for you based on the problem domain. It's just using naive RAG atm afaik, but I'm sure they are planning something more sophisticated.
# Search Query
AI journalling assistant
# Search Results
Title: The Best All-in-One AI Writing Assistant | HIX AI Review
Channel: AI Andy
Views: 3290
Duration: 0:11:20
Chapters:
1. Intro
2. Go to HIX Ai
3. AI Writer
4. Twitter Thread
5. LinkedIn Post
6. Long-Form Article
7. Hix Ai Chrome Extension
8. Prices
---
Title: AI Journaling Assistant
Channel: Jumble Journal
Views: 58
Duration: 0:00:40
Chapters:
undefined
---
Title: This AI can do your homework for you!
Channel: Tucciversity
Views: 286491
Duration: 0:00:38
Chapters:
undefined
`.trim(),
  },
  {
    role: "assistant",
    content: null,
    function_call: {
      name: "recommendVideos",
      arguments: JSON.stringify({
        recommendedVideos: [
          { id: 0, relevance: 0.5 },
          { id: 1, relevance: 1 },
          { id: 2, relevance: 0.2 },
        ],
      } satisfies z.infer<typeof outputSchema>),
    },
  },
  {
    role: "user",
    content: `
# Twitter
{{ tweets }}
# Search Query
{{ query }}
# Search Results
{{ results }}
`.trim(),
  },
];

const inputSchema = z.object({
  tweets: z.string(),
  results: z.string(),
  query: z.string(),
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
  recommendedVideos: z.array(
    z.object({
      id: z.number(),
      relevance: z.number().describe("Relevance is a float between 0 and 1."),
    })
  ),
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
  model: "gpt-4",
  inputSchema,
});

if (require.main === module) {
  (async () => {
    dotenv.config();
    const searchResults = ``.trim();
    const tweets = "".trim();
    const { recommendedVideos } = await filterSearchResults.run({
      promptVars: {
        query: "AI journalling assistant",
        results: searchResults,
        tweets,
      },
      verbose: true,
    });
    console.log(
      recommendedVideos.map((video) => searchResults.split("---")[video.id])
    );
  })();
}
