import { RecursiveCharacterTextSplitter } from "../../../textSplitter";

// rough estimate of 4 characters per token
// using this instead of tokenizing because it's faster
const charactersPerToken = 4;

export const firstNTokens = (text: string, tokens: number) => {
  return text.slice(0, tokens * charactersPerToken);
};

export const splitTranscript = async (args: {
  text: string;
  tokens?: number;
  separators?: string[];
}) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: (args.tokens || 2000) * charactersPerToken,
    chunkOverlap: 200, // not sure if this is necessary
    separators: args.separators,
  }).splitText(args.text);
  return parts;
};
