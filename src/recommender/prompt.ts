import OpenAI from "openai";
import { ZodType, z } from "zod";
import { compilePrompt } from "./compilePrompt";

export class Prompt<
  InputSchema extends ZodType,
  OutputSchema extends ZodType | undefined = undefined
> {
  function?: {
    schema: OutputSchema extends ZodType ? OutputSchema : undefined;
    function?: OpenAI.ChatCompletionCreateParams.Function;
  };
  prompt: OpenAI.ChatCompletionMessageParam[];
  model: "gpt-3.5-turbo" | "gpt-4";
  inputSchema: InputSchema;

  constructor(args: {
    function?: {
      schema: OutputSchema extends ZodType ? OutputSchema : undefined;
      function?: OpenAI.ChatCompletionCreateParams.Function;
    };
    model: "gpt-3.5-turbo" | "gpt-4";
    prompt: OpenAI.ChatCompletionMessageParam[];
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
    const response = await new OpenAI().chat.completions.create({
      messages: compilePrompt(this.prompt, vars),
      model: this.model,
      function_call: this.function?.function,
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
