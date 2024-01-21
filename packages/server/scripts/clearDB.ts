import { PrismaClient } from "@prisma/client";
import { confirm } from "./confirm";

const prisma = new PrismaClient();

async function main() {
  const c = await confirm("Delete all DB data");
  if (!c) {
    console.log("Aborting");
    return;
  }
  await prisma.user.deleteMany({});
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
