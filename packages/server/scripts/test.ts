const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
prisma
  .$queryRaw(Prisma.sql`SELECT id FROM graphile_worker.jobs`)
  .then((jobId) => {
    if (jobId == null) {
      throw new Error("job not found");
    }
    console.log(jobId);
  });
