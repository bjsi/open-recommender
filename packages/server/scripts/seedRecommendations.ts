// requires experilearning user
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { userClipsMap } from "../src/testData";

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
  await prisma.recommendation.createMany({
    data: [
      ...userClipsMap["experilearning"].map((clip) => ({
        type: "youtube" as const,
        data: {
          title: clip.title,
          summary: clip.summary,
          url: clip.url,
        },
        userId: user.id,
      })),
    ],
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
