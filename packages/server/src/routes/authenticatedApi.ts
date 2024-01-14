import { Router } from "express";
import { prisma } from "../db";
import {
  VoteOnRecommendationOutput,
  voteOnRecommendationInputSchema,
} from "shared/schemas/voteOnRecommendation";
import {
  GetNoteForRecommendationOutput,
  UpdateNoteForRecommendationOutput,
  getNoteForRecommendationInputSchema,
  updateNoteForRecommendationInputSchema,
} from "shared/schemas/getNotes";
import { updateSummaryInputSchema } from "shared/schemas/updateSummary";
import {
  GetSummariesOutput,
  getSummariesSchema,
} from "shared/schemas/getSummaries";
import { summarySchema } from "shared/types/summary";

const authenticatedApiRoutes = Router();

authenticatedApiRoutes.post(
  "/get-note-for-recommendation",
  async (req, res) => {
    const data = getNoteForRecommendationInputSchema.parse(req.query);
    const user = await prisma.user.findUnique({
      where: {
        id: (req.user as any)?.id,
      },
    });
    if (!user) {
      res.status(400).json({ error: "user not found" });
      return;
    }
    const note = await prisma.note.findFirst({
      where: {
        userId: user.id,
        recommendationId: data.recommendationId,
      },
    });
    return res.json({ note } satisfies GetNoteForRecommendationOutput);
  }
);

authenticatedApiRoutes.post(
  "/update-note-for-recommendation",
  async (req, res) => {
    const data = updateNoteForRecommendationInputSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        id: (req.user as any)?.id,
      },
    });
    if (!user) {
      res.status(400).json({ error: "user not found" });
      return;
    }
    const note = await prisma.note.findFirst({
      where: {
        userId: user.id,
        recommendationId: data.recommendationId,
      },
    });
    if (note) {
      await prisma.note.update({
        where: {
          id: note.id,
        },
        data: {
          content: data.content,
        },
      });
    } else {
      await prisma.note.create({
        data: {
          content: data.content,
          recommendationId: data.recommendationId,
          userId: user.id,
        },
      });
    }
    return res.json({
      success: true,
    } satisfies UpdateNoteForRecommendationOutput);
  }
);

// TODO: rate limit
authenticatedApiRoutes.post("/vote", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: (req.user as any)?.id,
    },
  });
  if (!user) {
    res.status(400).json({ error: "user not found" });
    return;
  }
  const data = voteOnRecommendationInputSchema.parse(req.body);
  const recommendation = await prisma.recommendation.findUnique({
    where: {
      id: data.recommendationId,
    },
  });
  if (!recommendation) {
    res.status(400).json({ error: "recommendation not found" });
    return;
  }
  const vote = await prisma.vote.findFirst({
    where: {
      userId: user.id,
      recommendationId: recommendation.id,
    },
  });

  if (vote) {
    await prisma.vote.update({
      where: {
        id: vote.id,
      },
      data: {
        vote: data.vote,
      },
    });
  } else {
    await prisma.vote.create({
      data: {
        vote: data.vote,
        recommendationId: recommendation.id,
        userId: user.id,
      },
    });
  }
  return res.json({ vote: data.vote } satisfies VoteOnRecommendationOutput);
});

authenticatedApiRoutes.post("/update-summary", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: (req.user as any)?.id,
    },
  });
  if (!user) {
    res.status(400).json({ error: "user not found" });
    return;
  }
  const data = updateSummaryInputSchema.parse(req.body);
  const summary = await prisma.summary.findUnique({
    where: {
      id: data.summaryId,
    },
  });
  if (!summary) {
    res.status(400).json({ error: "recommendation not found" });
    return;
  }
  await prisma.summary.update({
    where: {
      id: summary.id,
    },
    data: {
      useForRecommendations: data.useForRecommendations,
      content: data.summary,
    },
  });
});

authenticatedApiRoutes.post("/get-summaries", async (req, res) => {
  const data = getSummariesSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  if (!user) {
    res.status(400).json({ error: "user not found" });
    return;
  }
  const raw = await prisma.summary.findMany({
    where: {
      userId: user.id,
    },
  });
  const validated = summarySchema.array().parse(raw);
  return res.json({
    summaries: validated,
  } satisfies GetSummariesOutput);
});

export { authenticatedApiRoutes };
