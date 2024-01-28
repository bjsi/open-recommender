/**
 * Scrape Twitter to infer user context.
 *
 * TODO: bios of recent follows?
 */

import { readFileSync, writeFileSync } from "fs";
import {
  TweetSchema,
  Tweet,
  TwitterUserSchema,
  TwitterUser,
} from "shared/src/manual/Tweet";
import path from "path";
import { TwitterAPI, initTwitterAPI } from "./twitterAPI";

const likeToString = (args: {
  like: z.infer<typeof LikeSchema>;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { like, inFeedOfUser, id } = args;
  const formattedTweet = compact([
    id != null && `ID: ${id}`,
    `Type: Like`,
    `Liked by ${inFeedOfUser.displayname}`,
    `${formatDisplayNameWithBio(like.tweetedBy)} (${like.date})`,
    like.content,
  ]).join("\n");
  return formattedTweet;
};

const replyToString = (args: {
  reply: z.infer<typeof ReplySchema>;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { reply, inFeedOfUser, id } = args;
  const formattedTweet = compact([
    id != null && `ID: ${id}`,
    `Type: Reply`,
    `${formatDisplayNameWithBio(reply.contextUser)} (${reply.contextDate})`,
    reply.contextContent,
    `${formatDisplayName(reply.replyUser.username)} (${reply.replyDate})`,
    reply.replyContent,
  ]).join("\n");
  return formattedTweet;
};

const quoteToString = (args: {
  quote: z.infer<typeof QuoteSchema>;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { quote, id } = args;
  const formattedTweet = compact([
    id != null && `ID: ${id}`,
    `Type: Quote`,
    `Tweeted by ${formatDisplayNameWithBio(quote.contextUser)} (${
      quote.contextDate
    })`,
    quote.contextContent,
    `Quoted by ${formatDisplayName(quote.replyUser.displayname)} (${
      quote.replyDate
    })`,
    quote.replyContent,
  ]).join("\n");
  return formattedTweet;
};

const retweetToString = (args: {
  retweet: z.infer<typeof RetweetSchema>;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { retweet, inFeedOfUser, id } = args;
  const formattedTweet = compact([
    id != null && `ID: ${id}`,
    `Type: Reweet`,
    `Retweeted by ${formatDisplayName(inFeedOfUser.displayname)}`,
    `${formatDisplayNameWithBio(retweet.tweetedBy)} (${retweet.date})`,
    retweet.content,
  ]).join("\n");
  return formattedTweet;
};

const normalTweetToString = (args: {
  tweet: z.infer<typeof NormalTweetSchema>;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { tweet, inFeedOfUser, id } = args;
  const formattedTweet = compact([
    id != null && `ID: ${id}`,
    `Type: Tweet`,
    `Tweeted by ${formatDisplayName(tweet.tweetedBy.displayname)} (${
      tweet.date
    })`,
    tweet.content,
  ]).join("\n");
  return formattedTweet;
};

// TODO: what if I quote a tweet and reply to it?
// TODO: dedupe retweet + like
export const tweetToString = (args: {
  data: Tweet;
  inFeedOfUser: TwitterUser;
  id?: number;
}) => {
  const { data, inFeedOfUser, id } = args;
  const tweet = formatTweet(data, inFeedOfUser);
  if (tweet.type === "like") {
    return likeToString({ like: tweet, inFeedOfUser, id });
  }
  if (tweet.type === "reply") {
    return replyToString({ reply: tweet, inFeedOfUser, id });
  }
  if (tweet.type === "quote") {
    return quoteToString({ quote: tweet, inFeedOfUser, id });
  }
  if (tweet.type === "retweet") {
    return retweetToString({ retweet: tweet, inFeedOfUser, id });
  }
  if (tweet.type === "tweet") {
    return normalTweetToString({ tweet, inFeedOfUser, id });
  }
  return null;
};

export const tweetsToString = (args: {
  tweets: Tweet[];
  inFeedOfUser: TwitterUser;
}) => {
  return args.tweets
    .map((tweet, idx) =>
      tweetToString({
        data: tweet,
        inFeedOfUser: args.inFeedOfUser,
        id: idx,
      })
    )
    .filter(Boolean)
    .join("\n---\n");
};

import { z } from "zod";
import { compact } from "lodash";

const TweetBaseSchema = z.object({
  id: z.number(),
  url: z.string(),
});

const ReplyBaseSchema = TweetBaseSchema.extend({
  replyContent: z.string(),
  replyDate: z.string(),
  replyUser: TwitterUserSchema,
  contextContent: z.string(),
  contextDate: z.string(),
  contextUser: TwitterUserSchema,
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
  tweetedBy: TwitterUserSchema,
});

const LikeSchema = TweetBaseSchema.extend({
  type: z.literal("like"),
  content: z.string(),
  date: z.string(),
  tweetedBy: TwitterUserSchema,
  likedBy: TwitterUserSchema,
});

const RetweetSchema = TweetBaseSchema.extend({
  type: z.literal("retweet"),
  content: z.string(),
  date: z.string(),
  tweetedBy: TwitterUserSchema,
  retweetedBy: TwitterUserSchema,
});

export const TweetTypeSchema = z.union([
  ReplySchema,
  QuoteSchema,
  NormalTweetSchema,
  LikeSchema,
  RetweetSchema,
]);
export type TweetType = z.infer<typeof TweetTypeSchema>;

const formatDisplayName = (displayname: string) => {
  return "@" + displayname.replace(/\s/g, "_");
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};

const formatDisplayNameWithBio = (user: TwitterUser) => {
  return `${formatDisplayName(user.displayname)} (bio: ${truncate(
    user.rawDescription.replace(/\n/g, " "),
    50
  )})`;
};

const replaceTcoUrls = (content: string, data: Tweet) => {
  for (const link of data.links) {
    if (link.tcourl) {
      content = content.replace(link.tcourl, link.url);
    }
  }
  return content;
};

const replaceUsernamesWithNames = (content: string, tweet: Tweet) => {
  let newContent = content;
  for (const mention of tweet.mentionedUsers) {
    newContent = newContent.replace(
      `@${mention.username}`,
      formatDisplayName(mention.displayname)
    );
  }
  return newContent;
};

const formatTweetContent = (content: string, tweet: Tweet) => {
  const cleaned = content
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .join("\n");
  const cleaned2 = replaceUsernamesWithNames(cleaned, tweet);
  const cleaned3 = replaceTcoUrls(cleaned2, tweet);
  return truncate(cleaned3, 2000);
};

export const formatTweet = (
  tweet: Tweet,
  inFeedOfUser: TwitterUser
): TweetType => {
  const contextTweet =
    tweet.retweetedTweet || tweet.quotedTweet || tweet.replyToTweet;
  const tweetContent = formatTweetContent(tweet.rawContent, tweet);
  const contextContent = contextTweet
    ? formatTweetContent(contextTweet.rawContent, contextTweet)
    : "";
  if (tweet.user.username !== inFeedOfUser.username) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "like",
      content: tweetContent,
      date: tweet.date.slice(0, 10),
      tweetedBy: tweet.user,
      likedBy: inFeedOfUser,
    };
  } else if (tweet.retweetedTweet) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "retweet",
      content: tweetContent,
      date: tweet.date.slice(0, 10),
      tweetedBy: tweet.retweetedTweet.user,
      retweetedBy: inFeedOfUser,
    };
  } else if (tweet.quotedTweet) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "quote",
      replyContent: tweetContent,
      replyDate: tweet.date.slice(0, 10),
      replyUser: tweet.user,
      contextContent: contextContent,
      contextDate: contextTweet!.date.slice(0, 10),
      contextUser: contextTweet!.user,
    };
  } else if (tweet.inReplyToTweetId && tweet.replyToTweet) {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "reply",
      replyContent: tweetContent,
      replyDate: tweet.date.slice(0, 10),
      replyUser: tweet.user,
      contextContent: contextContent,
      contextDate: contextTweet!.date.slice(0, 10),
      contextUser: contextTweet!.user,
    };
  } else {
    return {
      id: tweet.id,
      url: tweet.url,
      type: "tweet",
      content: tweetContent,
      date: tweet.date.slice(0, 10),
      tweetedBy: tweet.user,
    };
  }
};

export const formatTweets = (tweets: Tweet[], inFeedOfUser: TwitterUser) => {
  return tweets
    .map((tweet) => formatTweet(tweet, inFeedOfUser))
    .filter(Boolean) as TweetType[];
};

const isAdvert = (tweet: Tweet) => {
  const sources = [tweet.source, tweet.sourceUrl, tweet.sourceLabel];
  return (
    sources.some((source) =>
      ["ads", "advert", "brand networks", "twitter media studio"].some((x) =>
        source?.toLowerCase()?.includes(x)
      )
    ) ||
    (tweet.sourceLabel && !tweet.sourceLabel?.toLowerCase().includes("twitter"))
  );
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
  const user = TwitterUserSchema.parse(JSON.parse(userStr));
  return user;
};

export const getUserTweetHistory = async (
  api: TwitterAPI,
  user_login: string,
  n_tweets?: number,
  since_id?: number
) => {
  const tweetsStr =
    //since_id
    //? await api.get_tweets_since(user_login, since_id, n_tweets || 50)
    //:
    await api.get_tweets(user_login, n_tweets || 50);
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
    const n_tweets = parseInt(process.argv[3] || "20");
    console.log(`Getting ${n_tweets} tweets for user @${user}`);
    const { tweets, userProfile } =
      //loadExampleTweetHistory(user) ||
      await (async () => {
        const { api, bridge } = initTwitterAPI();
        const userProfile = await getUserProfile(api, user);
        const tweets = (await getUserTweetHistory(api, user, n_tweets)).filter(
          Boolean
        ) as Tweet[];
        // const profile = await getUserProfile(api, user);
        bridge.close();
        return {
          tweets,
          userProfile,
        };
      })();
    if (!tweets || tweets.length === 0) {
      console.log("No tweets found");
      return;
    }

    writeFileSync(
      path.join(
        __dirname,
        `${user}ExampleTweets-${new Date().toISOString()}.json`
      ),
      JSON.stringify(tweets, null, 2)
    );

    console.log(tweets);
    const str = tweetsToString({ tweets, inFeedOfUser: userProfile });
    console.log(str);
  })();
}
