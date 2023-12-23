import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { sharedCreateQueriesInstructions } from "./shared";
import { CreateQueriesInput } from "../schemas/createQueriesInputSchema";
import { CREATE_YOUTUBE_SEARCH_QUERIES } from "../createQueries";
import { CreateQueriesOutput } from "../schemas/createQueriesOutputSchema";

const promptData = {
  prompt: sharedCreateQueriesInstructions,
  exampleBio: `Currently building @OpenPipeAI. Formerly @ycombinator, @google. I am always down to go on a quest.`,
  exampleTweets: `
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
`.trim(),
  exampleQueries: [
    {
      query: "Sam Altman podcast",
      tweetIDs: [0, 1],
    },
    {
      query: "Emmett Shear OpenAI",
      tweetIDs: [1],
    },
    {
      query: "Open source LLMs podcast",
      tweetIDs: [2, 3, 5, 6, 8],
    },
    {
      query: "Microsoft Orca 2 performance",
      tweetIDs: [2, 3],
    },
    {
      query: "Mistral fine-tuning",
      tweetIDs: [4, 6],
    },
    {
      query: "GPT-4-Turbo evaluation",
      tweetIDs: [4, 6],
    },
    {
      query: "OpenAI open source alternatives",
      tweetIDs: [5, 8],
    },
    {
      query: "AGI economic impact",
      tweetIDs: [7],
    },
    {
      query: "OpenHermes ChatBot Arena",
      tweetIDs: [8, 9],
    },
  ],
};

export const withKyleExamplePrompt = new CandidatePrompt<CreateQueriesInput>({
  name: "withKyleExamplePrompt",
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
