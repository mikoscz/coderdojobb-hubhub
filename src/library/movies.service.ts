import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { movies } from "../drizzle/schema";
import * as schema from "../drizzle/schema";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";

const sqlite = new Database("hubhub.db");
const db = drizzle(sqlite, { schema });

export class MoviesService {
  async getAllMovies() {
    return db.select().from(movies);
  }

  async getMovieById(id: string) {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));

    if (!movie) {
      return null;
    }

    return movie;
  }

  async deleteMovieById(id: string) {
    return db.delete(movies).where(eq(movies.id, id));
  }

  async createMovie(
    movie: InferInsertModel<typeof movies>
  ): Promise<InferSelectModel<typeof movies>> {
    const [newMovie] = await db.insert(movies).values(movie).returning();
    return newMovie;
  }

  async updateMovie(
    id: string,
    updateData: { title?: string; description?: string; yearOfRelease?: number }
  ) {
    return db
      .update(movies)
      .set(updateData)
      .where(eq(movies.id, id))
      .returning();
  }
}
