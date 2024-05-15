import { Database } from "../common";
import { movies } from "../drizzle/schema";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";

export class MoviesService {
  constructor(private readonly db: Database) {}

  async getAllMovies() {
    return this.db.select().from(movies);
  }

  async getMovieById(id: string) {
    const [movie] = await this.db
      .select()
      .from(movies)
      .where(eq(movies.id, id));

    if (!movie) {
      return null;
    }

    return movie;
  }

  async deleteMovieById(id: string) {
    return this.db.delete(movies).where(eq(movies.id, id));
  }

  async createMovie(
    movie: InferInsertModel<typeof movies>
  ): Promise<InferSelectModel<typeof movies>> {
    const [newMovie] = await this.db.insert(movies).values(movie).returning();
    return newMovie;
  }

  async updateMovie(
    id: string,
    updateData: { title?: string; description?: string; yearOfRelease?: number }
  ) {
    return this.db
      .update(movies)
      .set(updateData)
      .where(eq(movies.id, id))
      .returning();
  }
}
