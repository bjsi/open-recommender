import BetterSqlite3 from "better-sqlite3";
import { load } from "sqlite-vss";
import { z } from "zod";
import {
  TweetTypeSchema,
  formatTweet,
  loadExampleTweetHistory,
  tweetToString,
} from "./twitter/getUserContext";
import { embedMany } from "./embed/embedText";
import { dbPath } from "./filesystem";

type Vector = number[];

export function setupSQLiteDatabase(
  database: BetterSqlite3.Database
): BetterSqlite3.Database {
  load(database);
  [
    `CREATE TABLE IF NOT EXISTS vectors (id TEXT PRIMARY KEY, data TEXT, vector TEXT)`,
    `CREATE VIRTUAL TABLE IF NOT EXISTS vss_vectors USING vss0(vector(1536))`,
  ].forEach((query) => database.prepare(query).run());

  return database;
}

export class SQLiteVectorIndex<DATA extends object | undefined> {
  readonly db: BetterSqlite3.Database;
  readonly schema: z.ZodType<DATA>;

  constructor({
    db,
    schema,
  }: {
    db: BetterSqlite3.Database;
    schema: z.ZodType<DATA>;
  }) {
    this.db = db;
    this.schema = schema;
  }

  async upsertMany(data: Array<{ id: string; vector: Vector; data: DATA }>) {
    const upsertData = this.db.transaction((items) => {
      const insertData = this.db.prepare(
        "INSERT OR REPLACE INTO vectors (id, data, vector) VALUES (?, ?, ?)"
      );
      const insertVss = this.db.prepare(
        "INSERT OR REPLACE INTO vss_vectors (rowid, vector) VALUES (?, ?)"
      );
      for (const item of items) {
        const dataString = JSON.stringify(item.data);
        const vectorString = JSON.stringify(item.vector);
        const result = insertData.run(item.id, dataString, vectorString);
        insertVss.run(result.lastInsertRowid, vectorString);
      }
    });

    upsertData(data);
  }

  async queryByVector({
    queryVector,
    similarityThreshold,
    maxResults,
  }: {
    queryVector: Vector;
    maxResults: number;
    similarityThreshold?: number;
  }): Promise<Array<{ id: string; data: DATA; similarity?: number }>> {
    const maxDistance = similarityThreshold
      ? 1 - similarityThreshold
      : undefined;
    const query = `WITH matches AS (
            SELECT rowid, distance FROM vss_vectors WHERE vss_search(vector, ?) ${
              maxDistance !== undefined ? `AND distance <= ${maxDistance}` : ""
            } ${maxResults ? `LIMIT ${maxResults}` : ""}
        ) SELECT vectors.id, vectors.data, matches.distance FROM matches LEFT JOIN vectors ON vectors.rowid = matches.rowid`;

    const statement = this.db.prepare(query);

    const result = statement.all(JSON.stringify(queryVector)) as {
      id: string;
      data: string;
      distance: number;
    }[];

    return result.map((row) => {
      const data = JSON.parse(row.data);
      const validatedData = this.schema.parse(data);
      return {
        id: row.id,
        data: validatedData,
        similarity: 1 - row.distance,
      };
    });
  }

  asIndex(): SQLiteVectorIndex<DATA> {
    return this;
  }
}

let _db: BetterSqlite3.Database;
let _vectorIndex: SQLiteVectorIndex<z.infer<typeof TweetTypeSchema>>;

export function getOrCreateVectorIndex() {
  if (!_vectorIndex) {
    _vectorIndex = new SQLiteVectorIndex({
      db: getOrCreateDB(),
      schema: TweetTypeSchema,
    });
  }
  return _vectorIndex;
}

export function getOrCreateDB() {
  if (!_db) {
    _db = new BetterSqlite3(dbPath);
    setupSQLiteDatabase(_db);
  }
  return _db;
}

(async () => {
  const index = new SQLiteVectorIndex({
    db: getOrCreateDB(),
    schema: TweetTypeSchema,
  });
  const tweets = loadExampleTweetHistory("experilearning") || [];
  const vectors = await embedMany(
    tweets
      .map((tweet) => tweetToString({ data: tweet, user: "experilearning" }))
      .filter(Boolean) as string[]
  );
  const data = tweets.map((tweet, idx) => ({
    id: tweet.id.toString(),
    data: formatTweet(tweet, "experilearning"),
    vector: vectors[idx],
  }));
  index.upsertMany(data);

  const query = tweets[0];
  console.log("QUERY: ", query);
  const queryVector = vectors[0];

  const results = await index.queryByVector({
    queryVector,
    maxResults: 5,
  });
  console.log("RESULTS...");
  console.log(results);
})().catch(console.error);
