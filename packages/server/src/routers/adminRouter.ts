import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { TweetSchema } from "shared/src/manual/Tweet";
import {
  addRecommendationSchema,
  addRecommendations,
} from "../lib/addRecomendations";

export const adminRouter = router({
  addRecommendations: publicProcedure
    .input(addRecommendationSchema)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return await addRecommendations({ input, user });
    }),
  getTweets: publicProcedure
    .input(
      z.object({
        username: z.string(),
        before: z.string().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
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
          ...(input.before
            ? { tweetedAt: { lt: new Date(input.before) } }
            : {}),
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
    }),
  saveTweets: publicProcedure
    .input(
      z.object({
        username: z.string(),
        tweets: TweetSchema.array(),
        summaryId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      await prisma.tweet.createMany({
        data: input.tweets.map((t) => ({
          tweetId: t.id,
          tweetedAt: t.date,
          userId: user.id,
          data: t as Record<string, any>,
          summaryId: input.summaryId,
        })),
      });
    }),
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followers: true,
          following: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return user;
    }),
});
