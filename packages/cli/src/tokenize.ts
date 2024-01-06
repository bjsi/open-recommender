import { getEncoding } from "js-tiktoken";

export async function tokenize(text: string) {
  const enc = getEncoding("cl100k_base");
  return enc.encode(text);
}
