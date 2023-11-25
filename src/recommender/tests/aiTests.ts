import { EvaluateTestSuite, generateTable } from "promptfoo";
import dotenv from "dotenv";
import promptfoo from "promptfoo";
import { ChunkTranscriptVars, chunkTranscript } from "../chunkTranscript";
import {
  AppraiseTranscriptInputVars,
  appraiseTranscript,
} from "../appraiseTranscript";
import { assertValidSchema } from "./helpers";

dotenv.config();

const promptTests: Record<string, EvaluateTestSuite> = {
  "chunk-transcript": {
    ...testOptions({
      prompt: chunkTranscript.prompt,
      functions: [chunkTranscript.function],
    }),
    tests: [
      {
        vars: {
          transcript: [
            {
              text: "This is a test",
              start: 0,
              end: 10,
              entities: ["test"],
            },
          ],
          videoTitle: "Test video",
          videoSummary: "This is a test video",
        } satisfies ChunkTranscriptVars,
        assert: [assertValidSchema(chunkTranscript.function!.schema)],
      },
    ],
  },
  "appraise-transcript": {
    ...testOptions({
      prompt: appraiseTranscript.prompt,
      functions: [appraiseTranscript.function],
    }),
    tests: [
      {
        vars: {
          transcript: "This is a test",
          videoTitle: "Test video",
          userContext: "This is a test user",
        } satisfies AppraiseTranscriptInputVars,
        assert: [assertValidSchema(appraiseTranscript.function!.schema)],
      },
    ],
  },
  "filter-search-results": {
    ...testOptions({
      prompt: appraiseTranscript.prompt,
      functions: [appraiseTranscript.function],
    }),
    tests: [
      {
        vars: {
          transcript: "This is a test",
          videoTitle: "Test video",
          userContext: "This is a test user",
        } satisfies AppraiseTranscriptInputVars,
        assert: [assertValidSchema(appraiseTranscript.function!.schema)],
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
