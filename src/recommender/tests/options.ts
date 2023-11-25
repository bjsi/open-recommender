import { ChatCompletionMessageParam } from "openai/resources";
import { OPENAI_CHAT_MODELS } from "../openai";

export const plainTextTestOptions = (opts: {
  prompt: ChatCompletionMessageParam[];
  model: keyof typeof OPENAI_CHAT_MODELS;
}) => {
  return {
    prompts: [JSON.stringify(opts.prompt)],
    providers: [
      {
        id: `openai:${opts.model}`,
      },
    ],
  };
};

export const functionCallTestOptions = (opts: {
  prompt: ChatCompletionMessageParam[];
  functions?: any[];
  model: keyof typeof OPENAI_CHAT_MODELS;
}) => {
  return {
    prompts: [JSON.stringify(opts.prompt)],
    providers: [
      {
        id: `openai:${opts.model}`,
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
