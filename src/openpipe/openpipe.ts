import OpenAI from "openai";
import { CandidatePrompt } from "prompt-iteration-assistant";
import { z } from "zod";

const client = new OpenAI();

export const openpipe = {
  functionCall: async function <
    Input extends Record<string, any>,
    Output extends Record<string, any>
  >(args: {
    prompt: CandidatePrompt<Input>;
    body: Omit<
      OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
      "messages"
    >;
    input?: z.ZodType<Input>;
    output: z.ZodType<Output>;
    vars: Input;
  }) {
    const validArgs = args.input?.parse?.(args.vars);
    const messages = args.prompt
      .withVariables((validArgs || {}) as Input)
      .compile();
    const response = await client.chat.completions.create({
      messages,
      ...args.body,
    });
    const valueText = response.choices[0]!.message.function_call!.arguments;
    const json = JSON.parse(valueText);
    return args.output?.parse?.(json);
  },
};
