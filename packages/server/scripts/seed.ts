import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { userClipsMap } from "../src/testData";
import { youtubeUrlToId, youtubeUrlWithoutTimestamp } from "shared/src/youtube";

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.findUnique({
    where: {
      username: "experilearning",
    },
  });
  if (!user) {
    return;
  }
  for (const clip of userClipsMap["experilearning"]) {
    let source = await prisma.recommendationSource.findUnique({
      where: {
        externalId: youtubeUrlToId(clip.url)!,
      },
    });
    if (!source) {
      source = await prisma.recommendationSource.create({
        data: {
          type: "youtube" as const,
          externalId: youtubeUrlToId(clip.url)!,
          data: {
            type: "youtube" as const,
            title: clip.title,
            url: youtubeUrlWithoutTimestamp(clip.url),
          },
        },
      });
    }
    if (!source) {
      console.error("Failed to create source");
      return;
    }
    const recommendation = await prisma.recommendation.create({
      data: {
        source: {
          connect: {
            id: source.id,
          },
        },
        public: true,
        sourceId: source.id,
        type: "youtube" as const,
        data: {
          type: "youtube" as const,
          title: clip.title,
          summary: clip.summary,
          url: clip.url,
        },
      },
    });

    await prisma.userRecommendation.create({
      data: {
        userId: user.id,
        recommendationId: recommendation.id,
      },
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
