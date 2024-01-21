import { getUserTweetHistory } from "./getUserContext";
import { initTwitterAPI } from "./twitterAPI";

interface FetchArgs {
  user: string;
  n_tweets?: number;
  since_id?: number;
}

async function fetch(args: FetchArgs) {
  const { api, bridge } = initTwitterAPI();
  const tweets = await getUserTweetHistory(
    api,
    args.user,
    args.n_tweets,
    args.since_id
  );
  bridge.close();
  return tweets;
}

export const twitter = {
  tweets: {
    fetch,
  },
};
