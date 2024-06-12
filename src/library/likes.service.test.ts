import { describe, expect, test } from "vitest";
import { LikesService } from "./likes.service";
import { likes, movies, users } from "../drizzle/schema";
import { setupTestDb } from "../test/helpers";

describe("LikesService#addLike", () => {
  test("adds likes correctly", async () => {
    const { dbClient } = setupTestDb();
    const service = new LikesService(dbClient);

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

    const sampleUsers = [
      {
        id: "84ff482c-468e-40cf-9859-2cd0ac9c7d91",
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        hashedPassword: "hashedPassword",
        saltPassword: "saltPassword",
      },
      {
        id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        hashedPassword: "hashedPassword",
        saltPassword: "saltPassword",
      },
    ];

    const sampleLikes = [
      {
        userId: sampleUsers[0].id,
        movieId: sampleMovies[0].id,
      },
      {
        userId: sampleUsers[1].id,
        movieId: sampleMovies[0].id,
      },
    ];

    await dbClient.insert(movies).values(sampleMovies);
    await dbClient.insert(users).values(sampleUsers);

    await service.addLikeToMovie(sampleUsers[0].id, sampleMovies[0].id);
    await service.addLikeToMovie(sampleUsers[1].id, sampleMovies[0].id);

    const result = await dbClient.select().from(likes);

    expect(result.length).toBe(2);
    expect(result).toMatchObject(sampleLikes);
  });
});

describe("LikesService#removeLike", () => {
  test("removes likes correctly", async () => {
    const {dbClient} = setupTestDb();
    const service = new LikesService(dbClient);

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

    const sampleUsers = [
      {
        id: "84ff482c-468e-40cf-9859-2cd0ac9c7d91",
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        hashedPassword: "hashedPassword",
        saltPassword: "saltPassword",
      },
      {
        id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        hashedPassword: "hashedPassword",
        saltPassword: "saltPassword",
      },
    ];

    const sampleLikes = [
      {
        userId: sampleUsers[0].id,
        movieId: sampleMovies[0].id,
      },
      {
        userId: sampleUsers[1].id,
        movieId: sampleMovies[0].id,
      },
    ];

    await dbClient.insert(movies).values(sampleMovies);
    await dbClient.insert(users).values(sampleUsers);
    await dbClient.insert(likes).values(sampleLikes);

    await service.removeLikeFromMovie(sampleUsers[0].id, sampleMovies[0].id);

    const result = await dbClient.select().from(likes);

    expect(result.length).toBe(1);
    expect(result).toMatchObject([sampleLikes[1]]);
  });
});
