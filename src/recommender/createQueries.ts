import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { Prompt } from "./prompt";
import dotenv from "dotenv";
import {
  loadExampleTweetHistory,
  tweetToString,
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
- Analyze the tweets from the user's Twitter feed to identify topics, events and niches that interest the user.
- Then, generate YouTube search queries to find videos, interviews and podcasts that are deeply aligned with the user's professional or hobbyist interests.
- Each query should be formulated as a 2-3 element array of concepts, prioritizing specific technical terms the user has mentioned.
- Include the IDs of the tweets that you used to generate each query.
- Create 10 queries.
`.trim(),
  exampleBio: `@experilearning: fascinated by LLM agents | building the best SRS app in the multiverse @rem_note`,
  exampleTweets: `
---
ID: 0
@experilearning (2023-11-07)
Experimenting with creating a AI journalling assistant rn. Getting the RAG/chat memory right is the most important part. Here's the approach that got the best results so far:
- take each paragraph
- add metadata using gpt (emotions mentioned, people mentioned, topics mentioned)
- for each theme (emotion/topic/person) take all paragraphs mentioning that theme and summarise using GPT
- when writing a new journal entry, extract themes (emotions/topics/people), then include all the summaries for those themes and get the AI to question you
It feels way better than naive RAG. Obviously it's more work, more expensive and you end up having to keep doing LLM calls to update the summaries over time, but I think it's worth it.
---
ID: 1
tweet: @experilearning (2023-11-10)
If enough people are interested in an Oxford e/acc meetup, sign up here and I'll organize it 🚀
(It won't be formal for the first one, so not sure if @BasedBeffJezos will talk)
https://t.co/iaOPTB5Wre
reply: @experilearning (2023-11-10)
https://t.co/MbqjeTmMnR
---
ID: 2
@experilearning (2023-11-13)
Full updated process:
1. Use GPT to chunk messy journals into sections with metadata.
- GPT groups and lightly edits them into titled sections with metadata
- Metadata includes emotions, people and topics.
2. For each emotion/topic/person take all paragraphs mentioning that theme and summarise.
3. When writing a new journal, extract emotions/topics/people and retrieve summaries.
4. Include both summaries and close vector search results in the chat as context for the AI journal assistant.
---
ID: 3
@experilearning (2023-11-11)
https://t.co/tv5ttJ4RHI is a cool writeup of an AI therapist for IFS style therapy which takes a similar approach by summarising themes into JSON, retrieving relevant themes during the chat session then updating the JSON summaries at the end
---
ID: 4
Liked by @experilearning
@dwarkesh_sp (2023-11-13)
Dominic Cummings (Former Chief Adviser to PM)
Full episode out Wednesday
“In one day on COVID, the day starts off with, are we going to have a lockdown?
Proceeds to the PM's girlfriend going crazy about the media.
Then Trump calling up saying, we've got to bomb all these people in Iraq.
It then goes to the deep state coming in saying, we don't think we should because it's probably going to bomb the wrong people.
And then other parts of the system come in and say, no, we should bomb them because we've got to stay friends with America.
If you haven't been in that environment, it's extremely hard to appreciate that you have these handful of people trying to come up with the right answers to extremely hard problems.
Then on top of that, you have these incredibly old, centralized bureaucracies actually trying to cope with all of this."
@Dominic2306
---
ID: 5
tweet: @ilyasut (2023-11-20)
I deeply regret my participation in the board's actions. I never intended to harm OpenAI. I love everything we've built together and I will do everything I can to reunite the company.
reply: @experilearning (2023-11-20)
the plot thickens lmao this is better than EastEnders
---
ID: 6
Liked by @experilearning
@ilyasut (2023-11-20)
I deeply regret my participation in the board's actions. I never intended to harm OpenAI. I love everything we've built together and I will do everything I can to reunite the company.
---
ID: 7
tweet: @bryancsk (2023-11-21)
The Three Body Problem is an e/acc piece of science fiction because, unlike the others that narrate the dangers of new technology, it describes the civilisation-ending consequences of *delaying* the development of new tech
reply: @experilearning (2023-11-22)
Instead of killing scientists, the aliens drove them crazy and spread doomerism to throttle Earth's capacity to create new knowledge. Its not the knowledge you create that kills you, it's the knowledge you didn't create and the danger you didn't foresee
https://t.co/gO6RPaJsjf
---
`.trim(),
  exampleQueries: [
    {
      query: ["AI", "journalling", "assistant"],
      tweetIDs: [0, 2],
    },
    {
      query: ["LLM", "journalling"],
      tweetIDs: [0, 2],
    },
    {
      query: ["LLM", "therapist"],
      tweetIDs: [3],
    },
    {
      query: ["AI", "therapist"],
      tweetIDs: [3],
    },
    {
      query: ["LLM", "Advanced", "RAG"],
      tweetIDs: [0, 2],
    },
    {
      query: ["e/acc", "meetup"],
      tweetIDs: [1],
    },
    {
      query: ["e/acc", "discussion"],
      tweetIDs: [1, 7],
    },
    {
      query: ["Dominic Cummings", "podcast"],
      tweetIDs: [4],
    },
    {
      query: ["OpenAI", "board", "drama"],
      tweetIDs: [5, 6],
    },
    {
      query: ["Three Body Problem", "analysis"],
      tweetIDs: [7],
    },
  ],
};

const prompt2 = {
  prompt: prompt1.prompt,
  exampleBio: `Currently building @OpenPipeAI. Formerly @ycombinator, @google. I am always down to go on a quest.`,
  exampleTweets: `
---
ID: 0
tweet: @sama (2023-11-17)
i loved my time at openai. it was transformative for me personally, and hopefully the world a little bit. most of all i loved working with such talented people.
will have more to say about what’s next later.
🫡
reply: @corbtt (2023-11-17)
No inside info on the latest events, but knowing Sam personally he was one of the people I trusted most with the world changing technology OpenAI is developing. Bummed out by this, but wish the best for both OpenAI and Sam.
---
ID: 1
Liked by @corbtt
@rowancheung (2023-11-21)
JUST IN: The new CEO of OpenAI, Emmett Shear, will quit if the OpenAI board can't provide evidence of why they fired Sam Altman.
---
ID: 2
Liked by @corbtt
@goodside (2023-11-21)
Microsoft’s new 13B Orca 2 outperforms 70B models on many evals.
Interesting synthetic instruct data:
1) try many detailed system prompts
2) generate answers using best prompt for each task
3) replace with generic system prompt in tuning demonstrations https://t.co/5n7kZflQGG
---
ID: 3
Liked by @corbtt
@MSFTResearch (2023-11-21)
At Microsoft, we’re expanding AI capabilities by training small language models to achieve the kind of enhanced reasoning and comprehension typically found only in much larger models. https://t.co/v67aumSQQX
---
ID: 4
@corbtt (2023-11-27)
On Saturday we shipped comparative evals to all our users! We use GPT-4 to compare outputs head to head and calculate a win rate for each model.
In a surprising twist, I've found multiple customer test sets where GPT-4 prefers fine-tuned Mistral to its own outputs! 👀
---
ID: 5
Liked by @corbtt
@JayScambler (2023-11-20)
If you were 100% reliant on OpenAI you need to start  exploring open source models TODAY – These are some of my favorite resources and applications. Links below. Who else am I missing?
1. @LMStudioAI
2. @Ollama_ai
3. @NousResearch
4. @shoggothsystems
5. @HarperSCarroll
---
ID: 6
@corbtt (2023-11-29)
GPT-4 does a great job with this. It consistently returns the summarized version as requested. Models like Mistral fine-tuned on GPT-4 also do great. But GPT-4-Turbo seems to consistently ignore the instructions to return the shortened version! 🤔 https://t.co/Lgm4ei3mP5
---
ID: 7
@corbtt (2023-11-27)
@vkhosla A tractor+combine can do 80% of the job that 80% of humans were doing pre-industrial-revolution. An AI that does 80% of 80% of jobs would be similarly transformational, but not sure it necessarily has to be AGI.
---
ID: 8
Liked by @corbtt
@Teknium1 (2023-11-29)
OpenHermes 2.5 is now on @lmsysorg's ChatBot Arena! Go and test out several models and compare them blind to determine who is the best!
Website: https://t.co/NTChcOXZFL
---
ID: 9
@corbtt (2023-11-29)
@Teknium1 @lmsysorg Awesome, was hoping it would show up there!
---
`.trim(),
  exampleQueries: [
    {
      query: ["OpenAI", "Sam Altman", "podcast"],
      tweetIDs: [0, 1],
    },
    {
      query: ["OpenAI", "Emmett Shear", "Sam Altman"],
      tweetIDs: [0, 1],
    },
    {
      query: ["Microsoft Orca 2", "performance"],
      tweetIDs: [2, 3],
    },
    {
      query: ["small", "LLM", "reasoning"],
      tweetIDs: [2, 3],
    },
    {
      query: ["Mistral", "fine-tuning"],
      tweetIDs: [4, 6],
    },
    {
      query: ["GPT-4-Turbo", "evaluation"],
      tweetIDs: [4, 6],
    },
    {
      query: ["OpenAI", "OSS", "alternatives"],
      tweetIDs: [5, 8],
    },
    {
      query: ["AGI", "economic", "impact"],
      tweetIDs: [7],
    },
    {
      query: ["OpenHermes", "ChatBot Arena"],
      tweetIDs: [8, 9],
    },
  ],
};

const prompts = [prompt1, prompt2];

export const createYouTubeSearchQueriesPrompts: ChatCompletionMessageParam[][] =
  prompts.map((prompt) => [
    {
      role: "system",
      content: prompt.prompt,
    },
    {
      role: "user",
      content: `
# Tweets
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
# Tweets
{{ tweets }}`,
    },
  ]);

const inputSchema = z.object({
  tweets: z.string(),
});

export type CreateQueriesInputVars = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  queries: z.array(
    z.object({
      query: z.array(z.string()),
      tweetIDs: z.array(z.number()),
    })
  ),
});

const functionCall: OpenAI.ChatCompletionCreateParams.Function = {
  name: "createYouTubeSearchQueries",
  description:
    "Create YouTube search queries based on the user's recent tweets.",
  parameters: zodToJsonSchema(outputSchema),
};

export const createYouTubeSearchQueries = (user: string) =>
  new Prompt({
    prompt:
      user !== "experilearning"
        ? createYouTubeSearchQueriesPrompts[0]
        : createYouTubeSearchQueriesPrompts[1],
    model: "gpt-4",
    input: inputSchema,
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
    const tweetsAsStr = tweets.map((tweet, idx) =>
      tweetToString({
        data: tweet,
        user,
        id: idx,
      })
    );
    const results = await createYouTubeSearchQueries(user).run({
      promptVars: {
        tweets: tweetsAsStr.join("\n---\n"),
      },
    });

    for (const result of results.queries) {
      console.log("---");
      console.log(result.query);
      console.log(result.tweetIDs);
      console.log(result.tweetIDs.map((id) => tweetsAsStr[id]));
    }
  })();
}
