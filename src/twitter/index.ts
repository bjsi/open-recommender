import { getUserTweetHistory } from "./getUserContext";
import { initTwitterAPI } from "./twitterAPI";

interface FetchArgs {
  user: string;
}

async function fetch(args: FetchArgs) {
  const { api, bridge } = initTwitterAPI();
  const tweets = await getUserTweetHistory(api, args.user);
  bridge.close();
  return tweets;
}

export const twitter = {
  tweets: {
    fetch,
  },
};
