import { describe, expect, test } from "vitest";
import { MoviesService } from "./movies.service";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { movies } from "../drizzle/schema";

function setupTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });

  migrate(db, { migrationsFolder: "drizzle" });

  return db;
}

test("MoviesService#getAllMovies", async () => {
  const db = setupTestDb();
  const service = new MoviesService(db);

  const sampleMovies = [
    {
      id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
      title: "The Matrix",
      description: "Neo xd",
      yearOfRelease: 1999,
    },

    {
      id: "84ff482c-468e-40cf-9859-2cd0ac9c7d91",
      title: "The Matrix Reloaded",
      description: "Neo xdd",
      yearOfRelease: 2003,
    },
  ];

  await db.insert(movies).values(sampleMovies);
  const result = await service.getAllMovies();

  expect(result.length).toBe(2);
  expect(result).toMatchObject(sampleMovies);
});

describe("MoviesService#updateMovie", () => {
  test("when movie exists updates title and description", async () => {
    const db = setupTestDb();
    const service = new MoviesService(db);

    const sampleMovies = [
      {
        id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
        title: "The Matrix",
        description: "Neo xd",
        yearOfRelease: 1999,
      },
    ];

    await db.insert(movies).values(sampleMovies);

    const result = await service.updateMovie(
      "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
      {
        title: "The Matrix Updated",
        description: "Trinity xd",
      }
    );

    expect(result).toMatchObject({
      id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
      title: "The Matrix Updated",
      description: "Trinity xd",
    });
  });

  test("when movie not exists returns null", async () => {
    const db = setupTestDb();
    const service = new MoviesService(db);

    const result = await service.updateMovie(
      "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
      {
        title: "The Matrix Updated",
        description: "Trinity xd",
      }
    );

    expect(result).toBeNull();
  });
});
