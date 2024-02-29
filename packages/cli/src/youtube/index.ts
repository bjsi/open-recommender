import { search } from "./search";
import { downloadTranscript, fetchTranscript } from "./transcript";

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
    download: (args: { videoId: string }) => {
      return downloadTranscript(args.videoId);
    },
  },
};
