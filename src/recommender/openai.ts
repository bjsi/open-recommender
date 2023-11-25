/*
 * Available OpenAI chat models, their token limits, and pricing.
 *
 * @see https://platform.openai.com/docs/models/
 * @see https://openai.com/pricing
 */
export const OPENAI_CHAT_MODELS = {
  "gpt-4": {
    contextWindowSize: 8192,
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
  },
  "gpt-4-0314": {
    contextWindowSize: 8192,
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
  },
  "gpt-4-0613": {
    contextWindowSize: 8192,
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
    fineTunedPromptTokenCostInMillicents: null,
    fineTunedCompletionTokenCostInMillicents: null,
  },
  "gpt-4-1106-preview": {
    contextWindowSize: 128000,
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-vision-preview": {
    contextWindowSize: 128000,
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-32k": {
    contextWindowSize: 32768,
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-4-32k-0314": {
    contextWindowSize: 32768,
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-4-32k-0613": {
    contextWindowSize: 32768,
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-3.5-turbo": {
    contextWindowSize: 4096,
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
    fineTunedPromptTokenCostInMillicents: 0.3,
    fineTunedCompletionTokenCostInMillicents: 0.6,
  },
  "gpt-3.5-turbo-1106": {
    contextWindowSize: 16385,
    promptTokenCostInMillicents: 0.1,
    completionTokenCostInMillicents: 0.2,
  },
  "gpt-3.5-turbo-0301": {
    contextWindowSize: 4096,
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
  },
  "gpt-3.5-turbo-0613": {
    contextWindowSize: 4096,
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
    fineTunedPromptTokenCostInMillicents: 1.2,
    fineTunedCompletionTokenCostInMillicents: 1.6,
  },
  "gpt-3.5-turbo-16k": {
    contextWindowSize: 16384,
    promptTokenCostInMillicents: 0.3,
    completionTokenCostInMillicents: 0.4,
  },
  "gpt-3.5-turbo-16k-0613": {
    contextWindowSize: 16384,
    promptTokenCostInMillicents: 0.3,
    completionTokenCostInMillicents: 0.4,
  },
};
