import { Prisma, PrismaClient } from "@prisma/client";
import { confirm } from "./confirm";
import { workerUtils } from "../src/tasks/workerUtils";

const prisma = new PrismaClient();

async function main() {
  const c = await confirm("Delete all DB data");
  if (!c) {
    console.log("Aborting");
    return;
  }
  await prisma.user.deleteMany({});
  const result = (
    (await prisma.$queryRaw(
      Prisma.sql`SELECT id FROM graphile_worker.jobs`
    )) as { id: string }[]
  ).map((x) => x.id);
  const utils = await workerUtils();
  await utils.permanentlyFailJobs(result);
  await prisma.recommendation.deleteMany();
  await prisma.pipelineTaskLog.deleteMany();
  await prisma.pipelineTask.deleteMany();
  await prisma.pipelineRun.deleteMany();
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
