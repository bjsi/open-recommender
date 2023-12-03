import { EvaluateTestSuite, generateTable } from "promptfoo";
import dotenv from "dotenv";
import promptfoo from "promptfoo";
import { ChunkTranscriptVars, chunkTranscript } from "../chunkTranscript";
import {
  AppraiseTranscriptInputVars,
  appraiseTranscript,
} from "../appraiseTranscript";
import { assertJSON, assertValidSchema } from "./helpers";
import { transcriptToString } from "../../youtube/transcript";
import {
  remnoteFlashcardsSearchResults,
  elonMuskSearchResults,
  learningVideoTranscript,
  spamVideoTranscript,
} from "./exampleData";
import {
  FilterSearchResultsInputVars,
  filterSearchResults,
  searchResultsToString,
} from "../filterSearchResults";
import { interleaveArrays } from "./utils";
import { functionCallTestOptions as functionCallOptions } from "./options";
import {
  CreateQueriesInputVars,
  createYouTubeSearchQueries,
  createYouTubeSearchQueriesPrompts,
} from "../createQueries";
import {
  loadExampleTweetHistory,
  tweetsToString,
} from "../../twitter/getUserContext";

dotenv.config();

const promptTests: Record<string, EvaluateTestSuite> = {
  "chunk-transcript": {
    ...functionCallOptions({
      model: chunkTranscript.model,
      prompts: [chunkTranscript.prompt],
      functions: [chunkTranscript.function!.function],
    }),
    tests: [
      {
        vars: {
          transcript: transcriptToString(learningVideoTranscript.cues),
          title: learningVideoTranscript.videoTitle,
        } satisfies ChunkTranscriptVars,
        assert: [
          assertValidSchema(chunkTranscript.function!.schema),
          assertJSON(chunkTranscript.function!.schema, (data) => {
            const intro = data.clips.find((section) =>
              section.tags.includes("Intro")
            );
            console.log(intro);
            return {
              pass: !!intro,
              score: intro ? 1 : 0,
              reason: "Intro section found",
            };
          }),
          assertJSON(chunkTranscript.function!.schema, (data) => {
            const outro = data.clips.find((section) =>
              section.tags.includes("Outro")
            );
            console.log(outro);
            return {
              pass: !!outro,
              score: outro ? 1 : 0,
              reason: "Outro section found",
            };
          }),
        ],
      },
    ],
  },
  "appraise-transcript": {
    ...functionCallOptions({
      model: appraiseTranscript.model,
      prompts: [appraiseTranscript.prompt],
      functions: [appraiseTranscript.function!.function],
    }),
    tests: [
      {
        vars: {
          transcript: transcriptToString(learningVideoTranscript.cues).slice(
            0,
            5000
          ),
          title: learningVideoTranscript.videoTitle,
        } satisfies AppraiseTranscriptInputVars,
        assert: [assertValidSchema(appraiseTranscript.function!.schema)],
      },
      {
        vars: {
          transcript: spamVideoTranscript,
          title: "The 10 AI Innovations Expected to Revolutionize 2024 - 2025",
        } satisfies AppraiseTranscriptInputVars,
        assert: [assertValidSchema(appraiseTranscript.function!.schema)],
      },
    ],
  },
  "filter-search-results": {
    ...functionCallOptions({
      model: filterSearchResults.model,
      prompts: [filterSearchResults.prompt],
      functions: [filterSearchResults.function!.function],
    }),
    tests: [
      {
        vars: {
          results: searchResultsToString(
            interleaveArrays(
              remnoteFlashcardsSearchResults,
              elonMuskSearchResults
            )
          ),
          queries: ["learning software."],
        } satisfies FilterSearchResultsInputVars,
        assert: [assertValidSchema(filterSearchResults.function!.schema)],
      },
    ],
  },
  "create-queries": {
    ...functionCallOptions({
      model: createYouTubeSearchQueries.model,
      prompts: createYouTubeSearchQueriesPrompts,
      functions: [createYouTubeSearchQueries.function!.function],
    }),
    tests: [
      // {
      //   vars: {
      //     tweets: tweetsToString(
      //       loadExampleTweetHistory("experilearning") || [],
      //       "experilearning"
      //     ),
      //   } satisfies CreateQueriesInputVars,
      //   assert: [],
      // },
      {
        vars: {
          tweets: tweetsToString({
            tweets: loadExampleTweetHistory("corbtt") || [],
            user: "corbtt",
          }),
        } satisfies CreateQueriesInputVars,
        assert: [],
      },
    ],
  },
  // "infer-interests": {
  //   ...plainTextTestOptions({
  //     model: createYouTubeSearchQueries.model,
  //     prompt: createYouTubeSearchQueries.prompt,
  //   }),
  //   tests: [
  //     {
  //       vars: {
  //         userContext:
  //           "The user is interested in software to assist with learning like Anki.",
  //       } satisfies CreateQueriesInputVars,
  //       assert: [],
  //     },
  //   ],
  // },
};

const main = async () => {
  const arg = process.argv[2];
  const tests = Object.entries(promptTests).filter(
    ([testName]) => !arg || testName === arg
  );
  if (!tests.length) {
    console.log(`No tests found for ${arg}`);
    return;
  }
  for (const [testName, test] of tests) {
    console.log(`Running test ${testName}`);
    const results = await promptfoo.evaluate(
      {
        ...test,
        env: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
      },
      {
        maxConcurrency: 2,
        showProgressBar: true,
      }
    );
    console.log(results);
    console.log(generateTable(results).toString());
  }
};

if (require.main === module) {
  main();
}
