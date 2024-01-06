import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { z } from "zod";
import { pipelineRunsFolder } from "../filesystem";
import { tryParseJSON } from "../utils";

const successSchema = z.object({
  success: z.literal(true),
  result: z.any(),
});

export type Success<T> = {
  success: true;
  result: T;
};

const failureSchema = z.object({
  success: z.literal(false),
  result: z.any(),
});

export type Failure = {
  success: false;
  result: any;
};

export type Either<T> = Success<T> | Failure;

const runResultSchema = z.union([successSchema, failureSchema]);

export const success = <T>(result: T): Success<T> => ({
  success: true,
  result,
});

export const failure = (result: any): Failure =>
  ({
    success: false,
    result,
  } as const);

export const runSchema = z.object({
  id: z.string(),
  stages: z.array(
    z.object({
      name: z.string(),
      result: runResultSchema,
    })
  ),
});

export type Run = z.infer<typeof runSchema>;

export const getRunById = (id: string) => {
  try {
    const runText = readFileSync(
      path.join(pipelineRunsFolder, `${id}.json`),
      "utf8"
    );
    const maybeRun = runSchema.safeParse(tryParseJSON(runText));
    return maybeRun.success ? maybeRun.data : undefined;
  } catch (e) {
    return undefined;
  }
};

export const saveRun = (run: z.infer<typeof runSchema>) => {
  const runId = run.id;
  const runPath = path.join(pipelineRunsFolder, `${runId}.json`);
  writeFileSync(runPath, JSON.stringify(run, null, 2), "utf8");
};

export const createRun = (runId: string) => {
  const run: Run = {
    id: runId,
    stages: [],
  };
  saveRun(run);
  return run;
};
