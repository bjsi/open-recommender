import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { TweetSchema } from "shared/src/manual/Tweet";
import { QueryModel } from "shared/src/schemas/Query";

export const adminRouter = router({
  addRecommendations: publicProcedure
    .input(
      z.object({
        username: z.string(),
        tweets: z.array(TweetSchema),
        summary: z.string(),
        clips: z.array(
          z.object({
            query: z.string(),
            searchResult: z.object({
              type: z.literal("youtube"),
              title: z.string(),
              url: z.string(),
              channelName: z.string().optional(),
              id: z.string(),
            }),
            title: z.string(),
            summary: z.string(),
            start: z.number(),
            end: z.number(),
            videoTitle: z.string(),
            videoUrl: z.string(),
            videoId: z.string(),
            text: z.string(),
          })
        ),
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
      // create summary
      const summary = await prisma.summary.create({
        data: {
          content: input.summary,
          public: true,
          userId: user.id,
        },
      });

      // add tweets
      await prisma.tweet.createMany({
        data: input.tweets.map((t) => ({
          tweetId: t.id,
          tweetedAt: t.date,
          userId: user.id,
          summaryId: summary.id,
          data: t as Record<string, any>,
        })),
      });

      // add clips and queries
      const queryStringToObjectId: Record<string, number> = {};

      for (let i = 0; i < input.clips.length; i++) {
        const clip = input.clips[i];
        const query = clip.query;
        const queryObjId = queryStringToObjectId[query];
        let queryObject;
        if (queryObjId) {

          queryObjId 
          (await prisma.query.findUnique({
            where: {
              id: queryObjId,
            },
          })) ??
          (await prisma.query.create({
            data: {
              text: query,
              summaryId: summary.id,
              public: true,
            },
          }));
        queryStringToObjectId[query] = queryObject.id;
      }
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
