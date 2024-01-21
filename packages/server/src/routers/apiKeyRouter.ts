import { YouTubeRecommendation } from "shared/src/manual/YouTubeRecommendation";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";

export const apiKeyRouter = router({
  getRecommendations: publicProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
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
});
