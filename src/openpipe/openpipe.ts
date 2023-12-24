import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import OpenAI from "openpipe/openai";
import {
  CandidatePrompt,
  ChatMessage,
  toCamelCase,
} from "prompt-iteration-assistant";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const client = new OpenAI();

export const openpipe = {
  /**
   * Here's where the integration with OpenPipe happens.
   * The API is exactly the same as OpenAI's API - you just replace `import OpenAI from "openai"` with `import OpenAI from "openpipe/openai"`.
   * Here I just added some extra function call schema validation logic.
   * To understand how the request logging works, see: https://docs.openpipe.ai/faq/how-reporting-works
   */
  functionCall: async function <
    Input extends Record<string, any>,
    Output extends Record<string, any>
  >(args: {
    function: {
      input?: z.ZodType<Input>;
      output: z.ZodType<Output>;
      name: string;
      description?: string;
    };
    prompt: CandidatePrompt<Input>;
    body: Omit<ChatCompletionCreateParamsNonStreaming, "messages">;
    vars: Input;
    // Enable logging to OpenPipe (disable for tests and sensitive information)
    enableOpenPipeLogging?: boolean;
    verbose?: boolean;
  }) {
    const validArgs = args.function?.input?.parse?.(args.vars);
    const messages = args.prompt
      .withVariables((validArgs || {}) as Input)
      .compile();
    const response = await client.chat.completions.create({
      messages:
        typeof messages === "string"
          ? [ChatMessage.system(messages)]
          : messages,
      functions: [
        {
          name: toCamelCase(args.function.name),
          description: args.function.description,
          parameters: zodToJsonSchema(args.function.output),
        },
      ],
      function_call: {
        name: toCamelCase(args.function.name),
      },
      ...args.body,
      openpipe: {
        // Optional tags (often used for prompt names)
        // Helps you filter down your fine tuning dataset
        // see the section on tags here for more info: https://docs.openpipe.ai/getting-started/openpipe-sdk
        tags: { prompt_id: args.prompt.name },
        // Enable/disable data collection
        logRequest: !!args.enableOpenPipeLogging,
      },
    });
    if (args.verbose) {
      console.log(JSON.stringify(response, null, 2));
    }
    const valueText = response.choices[0]!.message.function_call!.arguments;
    const json = JSON.parse(valueText);
    return args.function.output?.parse?.(json);
  },
};
