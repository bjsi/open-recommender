import { prisma } from "../db";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { PublicUserModel } from "shared/src/manual/PublicUser";
import { generateAPIKey } from "../generateAPIKey";
import { addPipeline } from "../tasks/worker";
import { getNumRunningPipelines } from "../lib/getNumRunningPipelines";
import { v4 as uuidv4 } from "uuid";

export const authenticatedRouter = router({
  voteOnRecommendation: publicProcedure
    .input(
      z.object({
        recommendationId: z.number(),
        vote: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return;
      }
      const recommendation = await prisma.recommendation.findUnique({
        where: {
          id: input.recommendationId,
        },
      });
      if (!recommendation) {
        throw new Error("recommendation not found");
      }
      const vote = await prisma.vote.findFirst({
        where: {
          userId: authenticatedUser.id,
          recommendationId: recommendation.id,
        },
      });

      const updatedVote = vote
        ? await prisma.vote.update({
            where: {
              id: vote.id,
              userId: authenticatedUser.id,
            },
            data: {
              vote: input.vote,
            },
          })
        : await prisma.vote.create({
            data: {
              vote: input.vote,
              recommendationId: recommendation.id,
              userId: authenticatedUser.id,
            },
          });
      return updatedVote.vote;
    }),
  getNoteForRecommendation: publicProcedure
    .input(
      z.object({
        recommendationId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return;
      }
      const note = await prisma.note.findFirst({
        where: {
          userId: authenticatedUser.id,
          recommendationId: input.recommendationId,
        },
      });
      return { note };
    }),
  updateNoteForRecommendation: publicProcedure
    .input(
      z.object({
        recommendationId: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return;
      }
      const note = await prisma.note.findFirst({
        where: {
          userId: authenticatedUser.id,
          recommendationId: input.recommendationId,
        },
      });
      const updatedNote = note
        ? await prisma.note.update({
            where: {
              id: note.id,
            },
            data: {
              content: input.content,
            },
          })
        : await prisma.note.create({
            data: {
              content: input.content,
              recommendationId: input.recommendationId,
              userId: authenticatedUser.id,
            },
          });
      return updatedNote;
    }),
  updateSummary: publicProcedure
    .input(
      z.object({
        summaryId: z.number(),
        summary: z.string(),
        useForRecommendations: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        throw new Error("user not found");
      }
      const summary = await prisma.summary.findUnique({
        where: {
          userId: authenticatedUser.id,
          id: input.summaryId,
        },
      });
      if (!summary) {
        throw new Error("summary not found");
      }
      const res = await prisma.summary.update({
        where: {
          userId: authenticatedUser.id,
          id: summary.id,
        },
        data: {
          useForRecommendations: input.useForRecommendations,
        },
      });
      return res;
    }),
  getSummaries: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return;
      }
      const summariesForUser = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!summariesForUser) {
        throw new Error("user not found");
      }
      const summaries = await prisma.summary.findMany({
        where: {
          userId: summariesForUser.id,
          public:
            // if the user is not the authenticated user, only return public summaries
            authenticatedUser.id !== summariesForUser.id ? true : undefined,
        },
      });
      return summaries as ((typeof summaries)[number] & { data: any })[];
    }),

  getPublicUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return;
      }
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
      return {
        ...PublicUserModel.parse(user),
        followers: user.followers.length,
        following: user.following.map((f) => ({
          createdAt: f.createdAt,
          followType: f.followType,
          user: PublicUserModel.parse(f.user),
        })),
      };
    }),
  isFollowing: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser || authenticatedUser.username === input.username) {
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followers: true,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return user.followers.some((f) => f.userId === authenticatedUser.id);
    }),
  toggleFollowing: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser || authenticatedUser.username === input.username) {
        return false;
      }
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new Error("user not found");
      }
      const follow = await prisma.follow.findFirst({
        where: {
          userId: authenticatedUser.id,
          followId: user.id,
        },
      });
      if (follow) {
        await prisma.follow.delete({
          where: {
            id: follow.id,
          },
        });
        return false;
      } else {
        const f = await prisma.follow.create({
          data: {
            userId: authenticatedUser.id,
            followType: "likes",
            followId: user.id,
          },
        });
        return !!f;
      }
    }),

  getAPIKey: publicProcedure.mutation(async ({ ctx }) => {
    const authenticatedUser = await prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
      },
    });
    if (!authenticatedUser) {
      return;
    }
    const { apiKey, hashedApiKey } = generateAPIKey();
    await prisma.user.update({
      where: {
        id: authenticatedUser.id,
      },
      data: {
        apiKey: hashedApiKey,
      },
    });
    return apiKey;
  }),

  getNumRunningPipelines: publicProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
      },
    });
    if (!user) {
      return;
    }
    return await getNumRunningPipelines(user);
  }),

  requestRecommendations: publicProcedure
    .input(
      z.object({
        summaryId: z.number().optional(),
        customQuery: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authenticatedUser = await prisma.user.findUnique({
        where: {
          id: ctx.user?.id,
        },
      });
      if (!authenticatedUser) {
        return { type: "error" as const, error: "User not found" };
      }

      const numRunning = await getNumRunningPipelines(authenticatedUser);
      if (numRunning && numRunning >= 2) {
        return {
          type: "error" as const,
          error: "You can only have max 2 pipelines running at a time",
        };
      }

      const summary = input.summaryId
        ? await prisma.summary.findFirst({
            where: {
              userId: authenticatedUser.id,
              id: input.summaryId,
            },
          })
        : undefined;

      const job = await addPipeline("twitter-pipeline-v1", {
        username: authenticatedUser.username,
        summary: summary?.id,
        queries: input.customQuery ? [input.customQuery] : undefined,
        runId: uuidv4(),
        emailResults: true,
      });

      return { type: "success" as const };
    }),
});
