import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export function setupTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });

  migrate(db, { migrationsFolder: "drizzle" });

  return { dbClient: db, db: sqlite };
}
