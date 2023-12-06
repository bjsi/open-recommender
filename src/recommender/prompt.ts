import OpenAI from "openpipe/openai";
import { ZodType, z } from "zod";
import { compilePrompt } from "./compilePrompt";
import { OPENAI_CHAT_MODELS } from "./openai";
import {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from "openai/resources";

const MAX_RETRIES = 3;

export class Prompt<
  InputSchema extends ZodType,
  OutputSchema extends ZodType | undefined = undefined
> {
  function?: {
    schema: OutputSchema extends ZodType ? OutputSchema : undefined;
    function?: ChatCompletionCreateParams.Function;
  };
  prompt: ChatCompletionMessageParam[];
  model: keyof typeof OPENAI_CHAT_MODELS;
  inputSchema: InputSchema;

  constructor(args: {
    function?: {
      schema: OutputSchema extends ZodType ? OutputSchema : undefined;
      function?: ChatCompletionCreateParams.Function;
    };
    model: keyof typeof OPENAI_CHAT_MODELS;
    prompt: ChatCompletionMessageParam[];
    inputSchema: InputSchema;
  }) {
    this.function = args.function;
    this.prompt = args.prompt;
    this.inputSchema = args.inputSchema;
    this.model = args.model;
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
    const promptVars = this.inputSchema.parse(args.promptVars);
    const messages = compilePrompt(this.prompt, promptVars);
    if (args.verbose) console.log(messages);
    const response = await new OpenAI().chat.completions.create({
      messages,
      model: this.model,
      function_call: this.function?.function,
      functions: this.function?.function ? [this.function.function] : undefined,
    });
    if (args.verbose) console.log(response.choices[0]);
    if (this.function?.schema) {
      const args = JSON.parse(
        response.choices[0].message.function_call?.arguments || "{}"
      );
      const parsed = this.function.schema.safeParse(args);
      return parsed.success
        ? parsed.data
        : this.run({ ...args, retries: (args.retries || 0) + 1 });
    } else {
      return response.choices[0].message.content as any;
    }
  };
}
