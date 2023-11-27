/**
 * Scrape Twitter to infer user context.
 *
 * user bio
 * tweets + retweets
 * replies
 * TODO: likes
 * TODO: bios of recent follows?
 */

import { readFile, readFileSync } from "fs";
import { TweetSchema, twitter } from "./twitter";

const UserContextSchema = TweetSchema.array();

const getUserContext = async (user_login: string) => {
  const tweetsStr = await twitter.api.get_user_info(user_login);
  const tweets = UserContextSchema.parse(JSON.parse(tweetsStr));
  return tweets;
};

const loadExampleContext = () => {
  const tweetsStr = readFileSync("exampleTweets.json", "utf-8");
  const tweets = UserContextSchema.parse(JSON.parse(tweetsStr));
  return tweets;
};

export const inferInterests = async (user_login: string) => {
  const ctx = await getUserContext(user_login);
};

if (require.main === module) {
  (async () => {
    const ctx = loadExampleContext();
    console.log(ctx);
  })();
}
