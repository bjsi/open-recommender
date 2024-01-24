import { prisma } from "../db";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { PublicUserModel } from "shared/src/manual/PublicUser";
import { YouTubeRecommendation } from "shared/src/manual/YouTubeRecommendation";

export const publicRouter = router({
  getRecommendations: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async (resolve) => {
      const { input } = resolve;
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      const raw = await prisma.userRecommendation.findMany({
        where: {
          userId: user.id,
        },
        include: {
          recommendation: {
            include: {
              source: {
                include: {
                  queries: {
                    include: {
                      query: {
                        include: {
                          summary: true,
                        },
                      },
                    },
                  },
                },
              },
              votes: {
                include: {
                  user: {
                    select: {
                      profile_image_url: true,
                      name: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          priority: "asc",
        },
      });
      const queriesAndSummaries = raw
        .flatMap((rec) => rec.recommendation.source.queries.map((q) => q.query))
        .filter((q) => q.summary.userId === user.id);
      const validated = raw.map((rec) => ({
        ...rec,
        recommendation: {
          ...rec.recommendation,
          data: YouTubeRecommendation.parse(rec.recommendation.data),
        },
        queries: queriesAndSummaries,
      }));
      return validated;
    }),
  topUsers: publicProcedure.query(async () => {
    const raw = await prisma.user.findMany({
      include: {
        recommendations: true,
      },
      where: {
        username: {
          in: ["experilearning", "bazinga"],
        },
      },
    });
    const validated = raw.map((user) => ({
      ...PublicUserModel.parse(user),
      recommendations: user.recommendations.length,
    }));
    return validated;
  }),
});
