//   title: string;
//   durationInSeconds: number;
//   description: string;
//   yearOfRelease: number;
//   addedAt: Date;

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { movies } from "../drizzle/schema";
const sqlite = new Database("hubhub.db");
const db = drizzle(sqlite);
// const result = await db.select().from(users);

const sampleMovies = [
  {
    id: "c9f0c745-0465-4bd1-bf0e-04722533901b",
    title: "Movie 1",
    durationInSeconds: 62 * 60,
    description: "Fancy moviee #1",
    yearOfRelease: 2024,
    addedAt: "2024-04-24T15:28:24.970Z",
  },
  {
    id: "623bba3a-b0f1-492f-bd27-37b767984afa",
    title: "Movie 2",
    durationInSeconds: 22 * 60,
    description: "Fancy moviee #2",
    yearOfRelease: 2022,
    addedAt: "2024-04-24T15:28:24.970Z",
  },
];

export class MoviesService {
  async getAllMovies() {
    return db.select().from(movies);
  }

  // async create() {
  //   return db.insert(movies).values(sampleMovies);
  // }
}
