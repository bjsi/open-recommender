// requires experilearning user
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { Summary } from "shared/types/summary";

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
  await prisma.summary.createMany({
    data: [
      // {
      //   userId: user.id,
      //   data: {
      //     tweetIds: [1, 2, 3],
      //     startDate: 1,
      //     endDate: 2,
      //     summary: "test",
      //   },
      // },
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
