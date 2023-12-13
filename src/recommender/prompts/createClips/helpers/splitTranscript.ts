import { RecursiveCharacterTextSplitter } from "../../../textSplitter";

export const splitTranscript = async (text: string) => {
  const parts = await new RecursiveCharacterTextSplitter({
    chunkSize: 2000 * 4,
    chunkOverlap: 200, // not sure if this is necessary
  }).splitText(text);
  return parts;
};
