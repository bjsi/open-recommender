import { z } from "zod";
import { prisma } from "../db";
import { UserModel } from "shared/src/schemas/user";
import { YouTubeRecommendationSource } from "shared/src/manual/YouTubeRecommendationSource";
import { ArticleRecommendationSource } from "shared/src/manual/ArticleRecommendationSource";
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

  for (const [query, clusters] of Object.entries(input.clips)) {
    const queryObject = await prisma.query.create({
      data: {
        text: query,
        summaryId: summary.id,
        public: true,
      },
    });
    for (const [subquery, clips] of Object.entries(clusters)) {
      const subqObj = await prisma.subQuery.create({
        data: {
          text: subquery,
          queryId: queryObject.id,
          public: true,
        },
      });

      for (const clip of clips) {
        let recommendationSource = await prisma.recommendationSource.findUnique(
          {
            where: {
              externalId:
                clip.type === "youtube" ? clip.videoId : clip.articleUrl,
            },
          }
        );

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
              type: clip.type,
              externalId:
                clip.type === "youtube" ? clip.videoId : clip.articleUrl,
              data:
                clip.type === "youtube"
                  ? ({
                      type: "youtube",
                      id: clip.videoId,
                      title: clip.videoTitle,
                    } satisfies YouTubeRecommendationSource)
                  : ({
                      type: "article",
                      title: clip.articleTitle,
                      url: clip.articleUrl,
                    } satisfies ArticleRecommendationSource),
            },
          });
        }

        const recommendation = await prisma.recommendation.create({
          data: {
            sourceId: recommendationSource.id,
            type: clip.type,
            public: true,
            subQuery: {
              connect: {
                id: subqObj.id,
              },
            },
            source: {
              connect: {
                id: recommendationSource.id,
              },
            },
            data:
              clip.type === "youtube"
                ? ({
                    type: "youtube",
                    title: clip.title,
                    summary: clip.question,
                    url: clip.videoUrl,
                  } satisfies YouTubeRecommendation)
                : ({
                    type: "article",
                    url: clip.articleUrl,
                    title: clip.articleTitle,
                  } satisfies ArticleRecommendationSource),
          },
        });

        await prisma.userRecommendation.create({
          data: {
            recommendationId: recommendation.id,
            userId: user.id,
          },
        });
      }
    }
  }
};
