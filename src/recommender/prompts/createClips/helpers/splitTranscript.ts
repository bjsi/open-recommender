import { RecursiveCharacterTextSplitter } from "../../../textSplitter";

// rough estimate of 4 characters per token
const charactersPerToken = 4;

export const firstNTokens = (text: string, tokens: number) => {
  return text.slice(0, tokens * charactersPerToken);
};

export const splitTranscript = async (text: string, tokens?: number) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: (tokens || 2000) * charactersPerToken,
    chunkOverlap: 200, // not sure if this is necessary
  }).splitText(text);
  return parts;
};
