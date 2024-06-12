import { expect, test } from "vitest";
import { build } from "../app";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { movies } from "../drizzle/schema";
import request from "supertest";
import { setupTestDb } from "../test/helpers";

test("GET /movies", async () => {
  const { dbClient, db } = setupTestDb();

  const app = build({
    db,
  });

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

  await dbClient.insert(movies).values(sampleMovies);

  const moviesWithLikes = sampleMovies.map((movie) => {
    return {
      ...movie,
      likes: 0,
    };
  });

  const response = await request(app)
    .get("/movies")
    .expect(200)
    .expect("Content-Type", /json/);

  expect(response.body).toMatchObject({ data: moviesWithLikes });
});
