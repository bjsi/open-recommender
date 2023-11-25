import { ChatCompletionMessageParam } from "openai/resources";

export const plainTextTestOptions = (opts: {
  prompt: ChatCompletionMessageParam[];
}) => {
  return {
    prompts: [JSON.stringify(opts.prompt)],
    providers: [
      {
        id: "openai:gpt-3.5-turbo",
      },
    ],
  };
};

export const functionCallTestOptions = (opts: {
  prompt: ChatCompletionMessageParam[];
  functions?: any[];
}) => {
  return {
    prompts: [JSON.stringify(opts.prompt)],
    providers: [
      {
        id: "openai:gpt-3.5-turbo",
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
