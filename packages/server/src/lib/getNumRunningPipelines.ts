import { UserModel } from "shared/src/schemas";
import { z } from "zod";
import { prisma } from "../db";
import { sortBy } from "remeda";

export async function getNumRunningPipelines(
  authenticatedUser: z.infer<typeof UserModel>
): Promise<number | undefined> {
  if (!authenticatedUser) {
    return;
  }
  const pipelines = (
    await prisma.pipelineRun.findMany({
      where: {
        username: authenticatedUser.username,
      },
      include: {
        tasks: true,
      },
    })
  )
    // TODO: check
    // slice(1) because the first task is the pipeline itself, doesn't get updated properly
    .filter((p) =>
      sortBy(p.tasks, (x) => x.createdAt.valueOf())
        .slice(1)
        .some((t) => t.status === "running")
    );

  return pipelines.length;
}
