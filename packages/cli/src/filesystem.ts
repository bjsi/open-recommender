import path from "path";

export const dataFolder = path.join(__dirname, "..", "data");
export const testDataFolder = path.join(__dirname, "recommender/tests/data");
export const dbPath = path.join(dataFolder, "db.sqlite");
export const pipelineRunsFolder = path.join(__dirname, "pipeline", "runs");
