import { EvaluateTestSuite, generateTable } from "promptfoo";
import dotenv from "dotenv";
import promptfoo from "promptfoo";
import { ChunkTranscriptVars, chunkTranscript } from "../chunkTranscript";
import {
  AppraiseTranscriptInputVars,
  appraiseTranscript,
} from "../appraiseTranscript";
import { assertValidSchema } from "./helpers";
import { transcriptToString } from "../../youtube/transcript";
import {
  exampleSearchResults1,
  exampleSearchResults2,
  exampleTranscript,
} from "./exampleData";
import {
  FilterSearchResultsInputVars,
  filterSearchResults,
  searchResultsToString,
} from "../filterSearchResults";
import { interleaveArrays } from "./utils";
import {
  functionCallTestOptions as functionCallOptions,
  plainTextTestOptions,
} from "./options";
import {
  CreateQueriesInputVars,
  createYouTubeSearchQueries,
} from "../createQueries";

dotenv.config();

const promptTests: Record<string, EvaluateTestSuite> = {
  "chunk-transcript": {
    ...functionCallOptions({
      model: chunkTranscript.model,
      prompt: chunkTranscript.prompt,
      functions: [chunkTranscript.function!.function],
    }),
    tests: [
      {
        vars: {
          transcript: transcriptToString(exampleTranscript.cues),
          videoTitle: exampleTranscript.videoTitle,
        } satisfies ChunkTranscriptVars,
        assert: [assertValidSchema(chunkTranscript.function!.schema)],
      },
    ],
  },
  "appraise-transcript": {
    ...functionCallOptions({
      model: appraiseTranscript.model,
      prompt: appraiseTranscript.prompt,
      functions: [appraiseTranscript.function!.function],
    }),
    tests: [
      {
        vars: {
          transcript: transcriptToString(exampleTranscript.cues),
          videoTitle: exampleTranscript.videoTitle,
          userContext: "The user is interested in learning software.",
        } satisfies AppraiseTranscriptInputVars,
        assert: [assertValidSchema(appraiseTranscript.function!.schema)],
      },
    ],
  },
  "filter-search-results": {
    ...functionCallOptions({
      model: filterSearchResults.model,
      prompt: filterSearchResults.prompt,
      functions: [filterSearchResults.function!.function],
    }),
    tests: [
      {
        vars: {
          searchResults: searchResultsToString(
            interleaveArrays(exampleSearchResults1, exampleSearchResults2)
          ),
          userContext: "The user is interested in learning software.",
        } satisfies FilterSearchResultsInputVars,
        assert: [assertValidSchema(filterSearchResults.function!.schema)],
      },
    ],
  },
  "create-queries": {
    ...plainTextTestOptions({
      model: createYouTubeSearchQueries.model,
      prompt: createYouTubeSearchQueries.prompt,
    }),
    tests: [
      {
        vars: {
          userContext:
            "The user is interested in software to assist with learning like Anki.",
        } satisfies CreateQueriesInputVars,
        assert: [],
      },
    ],
  },
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
    console.log(generateTable(results, Number.MAX_SAFE_INTEGER).toString());
  }
};

if (require.main === module) {
  main();
}
