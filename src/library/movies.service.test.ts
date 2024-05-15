import { expect, test } from "vitest";
import { MoviesService } from "./movies.service";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

function setupTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });

  migrate(db, { migrationsFolder: "drizzle" });

  return db;
}

test("MoviesService#getAllMovies", async () => {
  const db = setupTestDb();
  const service = new MoviesService(db);

  // await service.createMovie({
  //   id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
  //   title: "The Matrix",
  //   description: "",
  //   yearOfRelease: 1999,
  // });

  expect(await service.getAllMovies()).toEqual([]);
});
