import { z } from "zod";
import { prisma } from "../db";
import { UserModel } from "shared/src/schemas/user";
import { YouTubeRecommendationSource } from "shared/src/manual/YouTubeRecommendationSource";
import { YouTubeRecommendation } from "shared/src/manual/YouTubeRecommendation";
import { transcriptClipSchema } from "shared/src/manual/TranscriptClip";
import { articleSnippetSchema } from "shared/src/manual/ArticleSnippet";

export const addRecommendationSchema = z.object({
  username: z.string(),
  summary: z.string(),
  clips: z.record(
    z.record(z.union([transcriptClipSchema, articleSnippetSchema]).array())
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

  // for (let idx = 0; idx < input.clips.length; idx++) {
  //   const clip = input.clips[idx];
  //   const query = clip.query;
  //   const queryObjId = queryStringToObjectId[query];
  //   let queryObject;
  //   if (queryObjId) {
  //     queryObject = await prisma.query.findUnique({
  //       where: {
  //         id: queryObjId,
  //       },
  //     });
  //   }
  //   if (!queryObject) {
  //     queryObject = await prisma.query.create({
  //       data: {
  //         text: query,
  //         summaryId: summary.id,
  //         public: true,
  //       },
  //     });
  //   }
  //   queryStringToObjectId[query] = queryObject.id;

  //   let recommendationSource = await prisma.recommendationSource.findUnique({
  //     where: {
  //       externalId: clip.videoId,
  //     },
  //   });

  //   if (!recommendationSource) {
  //     recommendationSource = await prisma.recommendationSource.create({
  //       data: {
  //         queries: {
  //           create: [
  //             {
  //               queryId: queryObject.id,
  //             },
  //           ],
  //         },
  //         type: "youtube",
  //         externalId: clip.videoId,
  //         data: {
  //           type: "youtube",
  //           id: clip.videoId,
  //           title: clip.videoTitle,
  //         } satisfies YouTubeRecommendationSource,
  //       },
  //     });
  //   }

  //   const recommendation = await prisma.recommendation.create({
  //     data: {
  //       sourceId: recommendationSource.id,
  //       type: "youtube",
  //       public: true,
  //       source: {
  //         connect: {
  //           id: recommendationSource.id,
  //         },
  //       },
  //       data: {
  //         type: "youtube",
  //         title: clip.title,
  //         summary: clip.summary,
  //         url: clip.videoUrl,
  //       } satisfies YouTubeRecommendation,
  //     },
  //   });

  //   await prisma.userRecommendation.create({
  //     data: {
  //       recommendationId: recommendation.id,
  //       userId: user.id,
  //       priority: idx,
  //     },
  //   });
  // }
  // return {
  //   summaryId: summary.id,
  // };
};
