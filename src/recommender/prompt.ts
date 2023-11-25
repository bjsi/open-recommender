import OpenAI from "openpipe/openai";
import { ZodType, z } from "zod";
import { compilePrompt } from "./compilePrompt";
import { OPENAI_CHAT_MODELS } from "./openai";
import {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from "openai/resources";

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

  run = async (
    vars: z.infer<InputSchema>,
    verbose = false
  ): Promise<OutputSchema extends ZodType<infer U> ? U : string | null> => {
    const messages = compilePrompt(this.prompt, vars);
    if (verbose) console.log(messages);
    const response = await new OpenAI().chat.completions.create({
      messages,
      model: this.model,
      function_call: this.function?.function,
      functions: this.function?.function ? [this.function.function] : undefined,
    });
    if (verbose) console.log(response.choices[0]);
    if (this.function?.schema) {
      const args = JSON.parse(
        response.choices[0].message.function_call?.arguments || "{}"
      );
      return this.function.schema.parse(args);
    } else {
      return response.choices[0].message.content as any;
    }
  };
}
