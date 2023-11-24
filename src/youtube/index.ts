import { search } from "./search";
import { fetchTranscript } from "./transcript";

export const yt = {
  search,
  transcript: {
    fetch: fetchTranscript,
  },
};
