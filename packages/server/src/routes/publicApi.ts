import { Router } from "express";
import {
  GetRecommendationsOutput,
  getRecommendationsInputSchema,
} from "shared/schemas/getRecommendations";
import { prisma } from "../db";
import { GetUsersOutput } from "shared/schemas/getUsers";
import {
  recommendationSchema,
  recommendationWithVotesSchema,
} from "shared/schemas/recommendation";

const publicApiRoutes = Router();

publicApiRoutes.get("/top-users", async (req, res) => {
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
    recommendations: user.recommendations.map((rec) =>
      recommendationSchema.parse(rec)
    ),
  }));
  return res.json({ users: validated } satisfies GetUsersOutput);
});

publicApiRoutes.post("/get-recommendations", async (req, res) => {
  try {
    const data = getRecommendationsInputSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (!user) {
      res.status(400).json({ error: "user not found" });
      return;
    }
    const raw = await prisma.recommendation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        votes: true,
      },
    });
    const validated = recommendationWithVotesSchema.array().parse(
      raw.map((rec) => ({
        ...rec,
        votes: rec.votes.map((vote) => ({
          vote: vote.vote,
          userId: vote.userId,
        })),
      }))
    );
    res.json({ recommendations: validated } satisfies GetRecommendationsOutput);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }
});

export { publicApiRoutes };
