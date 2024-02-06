import { makeWorkerUtils } from "graphile-worker";

let workerUtilsPromise: ReturnType<typeof makeWorkerUtils> | null = null;

export function workerUtils() {
  if (!workerUtilsPromise) {
    workerUtilsPromise = makeWorkerUtils({
      connectionString: process.env.DATABASE_URL!,
    });
  }
  return workerUtilsPromise;
}
