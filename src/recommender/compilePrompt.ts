import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";

export const compilePrompt = (
  messages: ChatCompletionMessageParam[],
  variables: {}
): ChatCompletionMessageParam[] => {
  const compiledPrompt = messages.map((m) => {
    if (typeof m.content === "string") {
      return {
        ...m,
        content: m.content?.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
          return variables[key];
        }),
      };
    } else {
      return m;
    }
  }) as ChatCompletionMessage[];
  return compiledPrompt;
};
