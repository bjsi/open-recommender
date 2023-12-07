import OpenAI from "openpipe/openai";
import * as promptfoo from "promptfoo";
import { ZodObject, ZodType, z } from "zod";
import { OPENAI_CHAT_MODELS } from "./openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { functionCallTestOptions, plainTextTestOptions } from "./tests/options";
import zodToJsonSchema from "zod-to-json-schema";
import { assertJSON, assertValidSchema } from "./tests/helpers";
import { Command } from "commander";
import inquirer from "inquirer";
// @ts-ignore
import searchlist from "inquirer-search-list";
import dotenv from "dotenv";

dotenv.config();
inquirer.registerPrompt("search-list", searchlist);

const MAX_RETRIES = 3;

export type CandidatePrompt<Args> = {
  compile: (args: Args) => ChatCompletionMessageParam[];
  name: string;
};

export type ExampleDataSet<T extends ZodType> = Record<
  keyof z.infer<T>,
  ExampleForInputKey<T>
>;

export type ExampleForInputKey<T extends ZodType> = {
  name: string;
  key: keyof z.infer<T>;
  value: string;
};

export class Prompt<
  InputSchema extends ZodObject<any>,
  OutputSchema extends ZodType = ZodType<string | null>
> {
  name: string;
  description?: string;
  /**
   * The first prompt in the array is considered the "main" prompt.
   */
  prompts: CandidatePrompt<z.infer<InputSchema>>[];
  /**
   * Array of example data to use for CLI runs or testing.
   */
  exampleData: ExampleForInputKey<InputSchema>[];
  model: keyof typeof OPENAI_CHAT_MODELS;
  input: InputSchema;
  output?: OutputSchema;

  private tests: promptfoo.EvaluateTestSuite[] = [];

  constructor(args: {
    name: string;
    description?: string;
    model: keyof typeof OPENAI_CHAT_MODELS;
    prompts: CandidatePrompt<z.infer<InputSchema>>[];
    input: InputSchema;
    output?: OutputSchema;
    exampleData?: ExampleForInputKey<InputSchema>[];
  }) {
    this.name = args.name;
    this.output = args.output;
    this.description = args.description;
    this.prompts = args.prompts;
    this.input = args.input;
    this.model = args.model;
    this.exampleData = args.exampleData || [];
  }

  withTest = (
    name: string,
    promptVars: z.infer<InputSchema>,
    ...asserts: ((
      output: OutputSchema extends ZodType<infer U> ? U : string | null
    ) => {
      pass: boolean;
      score: number;
      reason: string;
    })[]
  ) => {
    const options = this.output
      ? functionCallTestOptions({
          prompts: this.prompts.map((prompt) => prompt.compile(promptVars)),
          functions: [
            {
              name: this.name,
              description: this.description,
              parameters: zodToJsonSchema(this.output),
            },
          ],
          model: this.model,
        })
      : plainTextTestOptions({
          prompts: this.prompts.map((prompt) => prompt.compile(promptVars)),
          model: this.model,
        });
    const defaultAsserts = this.output ? [assertValidSchema(this.output)] : [];
    const test: promptfoo.EvaluateTestSuite = {
      ...options,
      description: name,
      tests: [
        {
          vars: {
            ...promptVars,
          },
          assert: [
            ...defaultAsserts,
            ...(this.output
              ? asserts.map((a) => assertJSON(this.output!, a))
              : asserts.map((a) => ({
                  type: "javascript" as const,
                  value: (output: string) => {
                    return a(output as any);
                  },
                }))),
          ],
        },
      ],
    };

    this.tests.push(test);
    return this;
  };

  async runCLI() {
    const schema = z.union([
      z.object({
        test: z.string().optional(),
      }),
      z.object({
        ui: z.string().optional(),
      }),
    ]);
    const program = new Command();
    program.option("-t, --test <name>", "run a test").parse(process.argv);
    program.option("-u, --ui <name>", "open webui").parse(process.argv);
    program.option("-r, --run", "run the prompt").parse(process.argv);

    const opts = schema.parse({
      ...program.opts(),
    });
    if (Object.keys(opts).length === 0) {
      // Use Inquirer.js to display a selection menu
      const answers = await inquirer.prompt([
        {
          type: "search-list",
          name: "action",
          message: "Select an option:",
          choices: ["Run", "Test", "Open WebUI"],
        },
      ]);

      // Handle the selected option
      if (answers.action === "Test") {
        const test = await inquirer.prompt([
          {
            type: "search-list",
            name: "test",
            message: "Select a test:",
            choices: ["All", ...this.tests.map((test) => test.description)],
          },
        ]);
        if (test.test === "All") {
          await this.test();
        } else {
          await this.test(test.test);
        }
      } else if (answers.action === "Open WebUI") {
        // Implement the logic to open the WebUI
      } else if (answers.action === "Run") {
        const keys = Object.keys(
          this.input.shape
        ) as (keyof z.infer<InputSchema>)[];
        const args: z.infer<InputSchema> = {};
        for (const key of keys) {
          const examples = this.exampleData.filter((d) => d.key === key);
          if (examples.length) {
            const answer = await inquirer.prompt([
              {
                type: "search-list",
                name: key,
                message: key,
                choices: ["Input", ...examples.map((d) => d.name)],
              },
            ]);
            if (answer[key] === "Input") {
              const answer = await inquirer.prompt([
                {
                  type: "input",
                  name: key,
                  message: key,
                },
              ]);
              args[key] = answer[key];
            } else {
              args[key] = examples.find((d) => d.name === answer[key])
                ?.value as any;
            }
          } else {
            const answer = await inquirer.prompt([
              {
                type: "input",
                name: key,
                message: key,
              },
            ]);
            args[key] = answer[key];
          }
        }
        this.run({ promptVars: args, verbose: true });
      }
    }
  }

  async test(name?: string) {
    const tests = this.tests.filter(
      (test) => !name || test.description === name
    );
    if (!tests.length) {
      console.log(`No test found with name "${name}"`);
      return;
    }
    for (const test of tests) {
      console.log(`Running test ${test.description}`);
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
      for (let i = 0; i < results.table.head.prompts.length; i++) {
        const prompt = results.table.head.prompts[i];
        prompt.display = this.prompts[i].name;
      }
      console.log(promptfoo.generateTable(results).toString());
    }
  }

  run = async (args: {
    promptVars: z.infer<InputSchema>;
    verbose?: boolean;
    retries?: number;
  }): Promise<OutputSchema extends ZodType<infer U> ? U : string | null> => {
    if (args.retries) {
      console.log(`Retrying prompt: ${args.retries} of ${MAX_RETRIES}`);
      if (args.retries >= MAX_RETRIES) {
        throw new Error("Max retries exceeded");
      }
    }
    const promptVars = this.input.parse(args.promptVars);
    const messages = this.prompts[0].compile(promptVars);
    if (args.verbose) console.log(messages);
    const response = await new OpenAI().chat.completions.create({
      messages,
      model: this.model,
      function_call: this.output ? { name: this.name } : undefined,
      functions: this.output
        ? [
            {
              name: this.name,
              description: this.description,
              parameters: zodToJsonSchema(this.output),
            },
          ]
        : undefined,
    });
    if (args.verbose) console.log(response.choices[0]);
    if (this.output) {
      const args = JSON.parse(
        response.choices[0].message.function_call?.arguments || "{}"
      );
      const parsed = this.output.safeParse(args);
      return parsed.success
        ? parsed.data
        : this.run({ ...args, retries: (args.retries || 0) + 1 });
    } else {
      return response.choices[0].message.content as any;
    }
  };
}
