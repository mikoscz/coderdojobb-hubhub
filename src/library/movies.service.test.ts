import { describe, expect, test } from "vitest";
import { MoviesService } from "./movies.service";
import { likes, movies, users } from "../drizzle/schema";
import { setupTestDb } from "../test/helpers";

describe("MoviesService#getAllMovies", () => {
  test("if movies return correctly", async () => {
    const { dbClient, db } = setupTestDb();
    const service = new MoviesService(dbClient);

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
    const result = await service.getAllMovies();

    const moviesWithLikes = sampleMovies.map((movie) => {
      return {
        ...movie,
        likes: 0,
      };
    });

    expect(result.length).toBe(2);
    expect(result).toMatchObject(moviesWithLikes);
  });

  test("if movies have likes", async () => {
    const { dbClient } = setupTestDb();
    const service = new MoviesService(dbClient);

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

    const result = await service.getAllMovies();

    const moviesWithLikes = result.map((movie) => {
      return {
        ...movie,
        likes: movie.id === sampleMovies[0].id ? 2 : 0,
      };
    });

    expect(result.length).toBe(2);
    expect(result).toMatchObject(moviesWithLikes);
  });
});

describe("MoviesService#updateMovie", () => {
  test("when movie exists updates title and description", async () => {
    const { dbClient } = setupTestDb();
    const service = new MoviesService(dbClient);

    const sampleMovies = [
      {
        id: "b8e02380-6237-4255-aecf-4cf5a0fa59b2",
        title: "The Matrix",
        description: "Neo xd",
        yearOfRelease: 1999,
      },
    ];

    await dbClient.insert(movies).values(sampleMovies);

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
    const { dbClient } = setupTestDb();
    const service = new MoviesService(dbClient);

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
