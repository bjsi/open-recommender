import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function embedText(text: string) {
  const response = await new OpenAI().embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
  return response.data[0].embedding;
}

export async function embedMany(texts: string[]) {
  const response = await new OpenAI().embeddings.create({
    input: texts,
    model: "text-embedding-ada-002",
  });
  return response.data.map((d) => d.embedding);
}
