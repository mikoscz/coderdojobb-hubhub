import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { movies } from "../drizzle/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

const sqlite = new Database("hubhub.db");
const db = drizzle(sqlite);

export class MoviesService {
  async getAllMovies() {
    return db.select().from(movies);
  }

  async getMovieById(id: string) {}

  async createMovie(
    movie: InferInsertModel<typeof movies>
  ): Promise<InferSelectModel<typeof movies>> {
    const [newMovie] = await db.insert(movies).values(movie).returning();
    return newMovie;
  }
}
