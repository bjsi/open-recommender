import { z } from "zod";
import { prisma } from "../db";
import { UserModel } from "shared/src/schemas/user";
import { YouTubeRecommendationSource } from "shared/src/manual/YouTubeRecommendationSource";
import { YouTubeRecommendation } from "shared/src/manual/YouTubeRecommendation";

export const addRecommendationSchema = z.object({
  username: z.string(),
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
});

export type AddRecommendationInput = z.infer<typeof addRecommendationSchema>;

export const addRecommendations = async (args: {
  input: AddRecommendationInput;
  user: z.infer<typeof UserModel>;
}) => {
  const { input, user } = args;
  // create summary
  const summary = await prisma.summary.create({
    data: {
      content: input.summary,
      public: true,
      userId: user.id,
    },
  });

  // add clips and queries
  const queryStringToObjectId: Record<string, number> = {};

  for (let idx = 0; idx < input.clips.length; idx++) {
    const clip = input.clips[idx];
    const query = clip.query;
    const queryObjId = queryStringToObjectId[query];
    let queryObject;
    if (queryObjId) {
      queryObject = await prisma.query.findUnique({
        where: {
          id: queryObjId,
        },
      });
    }
    if (!queryObject) {
      queryObject = await prisma.query.create({
        data: {
          text: query,
          summaryId: summary.id,
          public: true,
        },
      });
    }
    queryStringToObjectId[query] = queryObject.id;

    let recommendationSource = await prisma.recommendationSource.findUnique({
      where: {
        externalId: clip.videoId,
      },
    });

    if (!recommendationSource) {
      recommendationSource = await prisma.recommendationSource.create({
        data: {
          queries: {
            create: [
              {
                queryId: queryObject.id,
              },
            ],
          },
          type: "youtube",
          externalId: clip.videoId,
          data: {
            type: "youtube",
            id: clip.videoId,
            title: clip.videoTitle,
          } satisfies YouTubeRecommendationSource,
        },
      });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        sourceId: recommendationSource.id,
        type: "youtube",
        public: true,
        source: {
          connect: {
            id: recommendationSource.id,
          },
        },
        data: {
          type: "youtube",
          title: clip.title,
          summary: clip.summary,
          url: clip.videoUrl,
        } satisfies YouTubeRecommendation,
      },
    });

    await prisma.userRecommendation.create({
      data: {
        recommendationId: recommendation.id,
        userId: user.id,
        priority: idx,
      },
    });
  }
  return {
    summaryId: summary.id,
  };
};
