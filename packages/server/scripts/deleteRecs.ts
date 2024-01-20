import { PrismaClient } from "@prisma/client";
import { confirm } from "./confirm";

const prisma = new PrismaClient();

async function main() {
  const c = await confirm("Delete all recommendations");
  if (!c) {
    console.log("Aborting");
    return;
  }

  await prisma.recommendation.deleteMany({});
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
