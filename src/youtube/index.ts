import { search } from "./search";
import { fetchTranscript } from "./transcript";

interface FetchArgs {
  id: string;
  title: string;
}

export const yt = {
  search,
  transcript: {
    fetch: (args: FetchArgs) => {
      return fetchTranscript(args.id, args.title);
    },
  },
};
