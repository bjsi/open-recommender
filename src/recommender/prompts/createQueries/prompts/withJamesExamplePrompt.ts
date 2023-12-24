import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { sharedCreateQueriesInstructions } from "./shared";
import { CREATE_YOUTUBE_SEARCH_QUERIES } from "../createQueries";
import { CreateQueriesOutput } from "../schemas/createQueriesOutputSchema";
import { CreateQueriesInput } from "../schemas/createQueriesInputSchema";

const exampleTweets = `
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
If you haven't been in that environment, it's extremely hard to appreciate that you have these handful of people trying to come up with the right answers to extremely hard problems.
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
`.trim();

const promptData = {
  instructions: sharedCreateQueriesInstructions,
  exampleBio: `@experilearning: fascinated by LLM agents | building the best SRS app in the multiverse @rem_note`,
  exampleTweets: exampleTweets,
  exampleQueries: [
    {
      query: "AI journalling assistant",
      tweetIDs: [0, 2],
    },
    {
      query: "AI therapist",
      tweetIDs: [3],
    },
    {
      query: "Advanced retrieval augmented generation",
      tweetIDs: [0, 2],
    },
    {
      query: "e/acc meetup",
      tweetIDs: [1],
    },
    {
      query: "Effective Accelerationism discussion",
      tweetIDs: [1, 7],
    },
    {
      query: "Dominic Cummings interview",
      tweetIDs: [4],
    },
    {
      query: "OpenAI board drama",
      tweetIDs: [5, 6],
    },
    {
      query: "Three Body Problem analysis",
      tweetIDs: [7],
    },
  ],
};

export const withJamesExamplePrompt = new CandidatePrompt<CreateQueriesInput>({
  name: "withJamesExamplePrompt",
  compile() {
    return [
      ChatMessage.system(sharedCreateQueriesInstructions),
      {
        role: "user",
        content: `
# Tweets
${promptData.exampleTweets}
`.trim(),
      },
      ChatMessage.assistant<CreateQueriesOutput>(null, {
        name: toCamelCase(CREATE_YOUTUBE_SEARCH_QUERIES),
        arguments: {
          queries: promptData.exampleQueries,
        },
      }),
      {
        role: "user",
        content: `
# Tweets
${this.getVariable("tweets")}
`.trim(),
      },
    ];
  },
});
