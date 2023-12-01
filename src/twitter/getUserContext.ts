/**
 * Scrape Twitter to infer user context.
 *
 * user bio
 * tweets + retweets
 * replies
 * TODO: likes
 * TODO: bios of recent follows?
 */

import { readFileSync, writeFileSync } from "fs";
import { TweetSchema, Tweet } from "./schemas";
import path from "path";
import { TwitterAPI, initTwitterAPI } from "./twitterAPI";

const UserContextSchema = TweetSchema.array();

// TODO: get replies using tweet.inReplyToTweetId?
// TODO: what if I quote a tweet and reply to it?
// TODO: dedupe retweet + like
export const tweetToString = (data: Tweet, user: string) => {
  const tweet = formatTweet(data, user);
  if (!tweet) {
    return null;
  }
  const type = tweet.type;
  const hasContext = type === "reply" || type === "quote";
  const date = hasContext ? tweet.replyDate : tweet.date;
  const content = hasContext ? tweet.replyContent : tweet.content;
  const formattedTweet = [
    tweet.type === "like" && `Liked by @${user}`,
    hasContext && `tweet: @${tweet.contextUser} (${tweet.contextDate})`,
    hasContext && tweet.contextContent,
    `${hasContext ? "reply: " : ""}@${
      type === "like" ? tweet.user : user
    } (${date})`,
    content,
  ]
    .filter(Boolean)
    .join("\n");
  return formattedTweet;
};

export const tweetsToString = (tweets: Tweet[], user: string) => {
  return tweets
    .map((tweet) => tweetToString(tweet, user))
    .filter(Boolean)
    .join("\n---\n");
};

import { z } from "zod";

const TweetBaseSchema = z.object({
  id: z.number(),
  url: z.string(),
});

const ReplyBaseSchema = TweetBaseSchema.extend({
  replyContent: z.string(),
  replyDate: z.string(),
  replyUser: z.string(),
  contextContent: z.string(),
  contextDate: z.string(),
  contextUser: z.string(),
});

const ReplySchema = ReplyBaseSchema.extend({
  type: z.literal("reply"),
});

const QuoteSchema = ReplyBaseSchema.extend({
  type: z.literal("quote"),
});

const NormalTweetSchema = TweetBaseSchema.extend({
  type: z.literal("tweet"),
  content: z.string(),
  date: z.string(),
  user: z.string(),
});

const LikeSchema = TweetBaseSchema.extend({
  type: z.literal("like"),
  content: z.string(),
  date: z.string(),
  user: z.string(),
  likedBy: z.string(),
});

export const TweetTypeSchema = z.union([
  //ReplySchema,
  QuoteSchema,
  NormalTweetSchema,
  LikeSchema,
]);
export type TweetType = z.infer<typeof TweetTypeSchema>;

const formatTweetContent = (content: string) => {
  return content
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .join("\n");
};

const formatTweet = (tweet: Tweet, user: string): TweetType | null => {
  const contextTweet = tweet.retweetedTweet || tweet.quotedTweet;
  const tweetContent = formatTweetContent(tweet.rawContent);
  const contextContent = formatTweetContent(contextTweet?.rawContent || "");
  if (tweet.user.username !== user) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "like",
      content: tweetContent,
      date: tweet.date.slice(0, 10),
      user: tweet.user.username,
      likedBy: user,
    };
  } else if (tweet.quotedTweet) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "quote",
      replyContent: tweetContent,
      replyDate: tweet.date.slice(0, 10),
      replyUser: tweet.user.username,
      contextContent: contextContent,
      contextDate: contextTweet!.date.slice(0, 10),
      contextUser: contextTweet!.user.username,
    };
  } else if (tweet.inReplyToTweetId) {
    return null;
    // @ts-ignore
    // return {
    // id: tweet.id,
    // url: tweet.url,
    // type: "reply",
    // replyContent: tweetContent,
    // replyDate: tweet.date.slice(0, 10),
    // replyUser: tweet.user.username,
    // contextContent: contextContent,
    // contextDate: contextTweet!.date.slice(0, 10),
    // contextUser: contextTweet!.user.username,
    // };
  } else {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "tweet",
      content: tweetContent,
      date: tweet.date.slice(0, 10),
      user: tweet.user.username,
    };
  }
};

export const formatTweets = (tweets: Tweet[], user: string) => {
  return tweets
    .map((tweet) => formatTweet(tweet, user))
    .filter(Boolean) as TweetType[];
};

const isAdvert = (tweet: Tweet) => {
  const sources = [tweet.source, tweet.sourceUrl, tweet.sourceLabel];
  return sources.some((x) => x?.toLowerCase()?.includes("advert"));
};

const parseTweets = (tweetsStr: string) => {
  const tweets = UserContextSchema.parse(JSON.parse(tweetsStr));
  return tweets.filter((tweet) => !isAdvert(tweet));
};

export const getUserTweetHistory = async (
  api: TwitterAPI,
  user_login: string,
  n_tweets?: number
) => {
  const tweetsStr = await api.get_tweets(user_login, n_tweets || 50);
  return parseTweets(tweetsStr);
};

export const loadExampleTweetHistory = (user: string) => {
  try {
    const tweetsStr = readFileSync(
      path.join(__dirname, `${user}ExampleTweets.json`),
      "utf-8"
    );
    return parseTweets(tweetsStr);
  } catch {
    return null;
  }
};

if (require.main === module) {
  (async () => {
    const user = (process.argv[2] || "experilearning").replace("@", "");
    const tweets =
      loadExampleTweetHistory(user) ||
      (await (async () => {
        const { api, bridge } = initTwitterAPI();
        const tweets = await getUserTweetHistory(api, user);
        bridge.close();
        return tweets;
      })());
    if (!tweets || tweets.length === 0) {
      console.log("No tweets found");
      return;
    }
    writeFileSync(
      path.join(__dirname, `${user}ExampleTweets.json`),
      JSON.stringify(tweets, null, 2)
    );
    const str = tweetsToString(tweets, user);
    console.log(str);
  })();
}
