/**
 * Scrape Twitter to infer user context.
 *
 * TODO: bios of recent follows?
 */

import { readFileSync, writeFileSync } from "fs";
import { TweetSchema, Tweet, UserSchema } from "./schemas";
import path from "path";
import { TwitterAPI, initTwitterAPI } from "./twitterAPI";

// TODO: what if I quote a tweet and reply to it?
// TODO: dedupe retweet + like
export const tweetToString = (args: {
  data: Tweet;
  user: string;
  id?: number;
}) => {
  const { data, user, id } = args;
  const tweet = formatTweet(data, user);
  const type = tweet.type;
  const hasContext = type === "quote" || type === "reply";
  const date = hasContext ? tweet.replyDate : tweet.date;
  const content = hasContext ? tweet.replyContent : tweet.content;
  const formattedTweet = [
    id && `ID: ${id}`,
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

export const tweetsToString = (args: { tweets: Tweet[]; user: string }) => {
  return args.tweets
    .map((tweet, idx) =>
      tweetToString({
        data: tweet,
        user: args.user,
        id: idx,
      })
    )
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
  ReplySchema,
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

export const formatTweet = (tweet: Tweet, user: string): TweetType => {
  const contextTweet =
    tweet.retweetedTweet || tweet.quotedTweet || tweet.replyToTweet;
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
  } else if (tweet.inReplyToTweetId && tweet.replyToTweet) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "reply",
      replyContent: tweetContent,
      replyDate: tweet.date.slice(0, 10),
      replyUser: tweet.user.username,
      contextContent: contextContent,
      contextDate: contextTweet!.date.slice(0, 10),
      contextUser: contextTweet!.user.username,
    };
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

const parseTweet = (tweetStr: string | null) => {
  if (!tweetStr) {
    return null;
  }
  const tweet = TweetSchema.parse(JSON.parse(tweetStr));
  return isAdvert(tweet) ? null : tweet;
};

const parseTweets = (tweetsStr: string) => {
  const tweets = TweetSchema.array().parse(JSON.parse(tweetsStr));
  return tweets.filter((tweet) => !isAdvert(tweet));
};

export const getUserProfile = async (api: TwitterAPI, user_login: string) => {
  const userStr = await api.get_user(user_login);
  const user = UserSchema.parse(JSON.parse(userStr));
  return user;
};

export const getUserTweetHistory = async (
  api: TwitterAPI,
  user_login: string,
  n_tweets?: number
) => {
  const tweetsStr = await api.get_tweets(user_login, n_tweets || 50);
  const tweets = parseTweets(tweetsStr);
  // for (const tweet of tweets) {
  //   if (tweet.inReplyToTweetId != null) {
  //     console.log("Getting reply to tweet: ", tweet.inReplyToTweetId);
  //     const str = await api.get_tweet(tweet.inReplyToTweetId);
  //     console.log("Got reply to tweet: ", str);

  //     tweet.replyToTweet = parseTweet(str);
  //   }
  // }
  return tweets;
};

export const loadExampleTweetHistory = (user: string) => {
  try {
    const tweetsStr = readFileSync(
      path.join(__dirname, `${user}ExampleTweets.json`),
      "utf-8"
    );
    return parseTweets(tweetsStr);
  } catch {
    return [];
  }
};

if (require.main === module) {
  (async () => {
    const user = (process.argv[2] || "experilearning").replace("@", "");
    const tweets =
      loadExampleTweetHistory(user) ||
      (await (async () => {
        const { api, bridge } = initTwitterAPI();
        const tweets = (await getUserTweetHistory(api, user, 20)).filter(
          Boolean
        ) as Tweet[];
        const profile = await getUserProfile(api, user);
        bridge.close();
        return {
          tweets,
          profile,
        };
      })());
    if (!tweets || tweets.length === 0) {
      console.log("No tweets found");
      return;
    }
    // writeFileSync(
    //   path.join(__dirname, `${user}ExampleTweets.json`),
    //   JSON.stringify(tweets, null, 2)
    // );
    const str = tweetsToString({ tweets, user });
    console.log(str);
    // console.log("Profile: ", profile);
  })();
}
