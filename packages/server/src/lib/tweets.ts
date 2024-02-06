import { TweetSchema } from "shared/src/manual/Tweet";
import { prisma } from "../db";

export async function getSavedTweetsForUser(input: {
  username: string;
  before?: string;
  limit?: number;
}) {
  const user = await prisma.user.findUnique({
    where: {
      username: input.username,
    },
  });
  if (!user) {
    throw new Error("user not found");
  }
  const tweets = await prisma.tweet.findMany({
    where: {
      userId: user.id,
      ...(input.before ? { tweetedAt: { lt: new Date(input.before) } } : {}),
    },
    orderBy: {
      tweetedAt: "desc",
    },
    take: input.limit,
  });
  return tweets.map((t) => ({
    ...t,
    data: TweetSchema.parse(t.data),
  }));
}
