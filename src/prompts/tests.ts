import { EvaluateTestSuite, generateTable } from "promptfoo";
import dotenv from "dotenv";
import { z } from "zod";
import promptfoo from "promptfoo";
import {
  ChunkTranscriptVars,
  chunkTranscriptFunction,
  chunkTranscriptPrompt,
  chunkTranscriptSchema,
} from "./chunkTranscript";
import {
  AppraiseTranscriptVars,
  appraiseTranscriptFunction,
  appraiseTranscriptPrompt,
  appraiseTranscriptSchema,
} from "./appraiseTranscript";
import {
  SummarizeTranscriptVars,
  summarizeTranscriptPrompt,
} from "./summarizeTranscript";

dotenv.config();

const testOptions = (opts: { prompt: Record<any, any>; functions?: any[] }) => {
  return {
    prompts: [JSON.stringify(opts.prompt)],
    providers: [
      {
        id: "openai:gpt-4",
        config: {
          functions: opts.functions,
        },
      },
    ],
    defaultTest: {
      options: {
        postprocess: "JSON.stringify(JSON.parse(output.arguments), null, 2)",
      },
    },
  };
};

const assertValidSchema = (schema: z.ZodSchema<any>) => {
  return {
    type: "javascript",
    value: (output: any) => {
      const json = JSON.parse(output);
      const validation = schema.safeParse(json);
      if (!validation.success) {
        return {
          pass: false,
          score: 0,
          reason: validation.error.message,
        };
      } else {
        return {
          pass: true,
          score: 1,
          reason: "Successfully parsed JSON using zod schema.",
        };
      }
    },
  } as const;
};

const promptTests: Record<string, EvaluateTestSuite> = {
  "chunk-transcript": {
    ...testOptions({
      prompt: chunkTranscriptPrompt,
      functions: [chunkTranscriptFunction],
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
        assert: [assertValidSchema(chunkTranscriptSchema)],
      },
    ],
  },
  "appraise-transcript": {
    ...testOptions({
      prompt: appraiseTranscriptPrompt,
      functions: [appraiseTranscriptFunction],
    }),
    tests: [
      {
        vars: {
          transcript: "This is a test",
          videoTitle: "Test video",
        } satisfies AppraiseTranscriptVars,
        assert: [assertValidSchema(appraiseTranscriptSchema)],
      },
    ],
  },
  "summarize-transcript": {
    ...testOptions({
      prompt: summarizeTranscriptPrompt,
    }),
    tests: [
      {
        vars: {
          transcript: "This is a test",
          videoTitle: "Test video",
        } satisfies SummarizeTranscriptVars,
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

main();
