import { prisma } from "../db";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { YouTubeRecommendation } from "shared/src/schemas/YouTubeRecommendation";

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
              votes: true,
            },
          },
        },
      });
      const validated = raw.map((rec) => ({
        ...rec,
        recommendation: {
          ...rec.recommendation,
          data: YouTubeRecommendation.parse(rec.recommendation.data),
        },
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
          in: ["experilearning"],
        },
      },
    });
    const validated = raw.map((user) => ({
      ...user,
      recommendations: user.recommendations.length,
    }));
    return validated;
  }),
});
