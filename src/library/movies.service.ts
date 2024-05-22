import { likes, movies } from "../drizzle/schema";
import { Database } from "../common";
import { InferInsertModel, InferSelectModel, count, eq } from "drizzle-orm";

export class MoviesService {
  constructor(private readonly db: Database) {}

  async getAllMovies() {
    const res = await this.db
      .select({
        id: movies.id,
        title: movies.title,
        description: movies.description,
        yearOfRelease: movies.yearOfRelease,
        likes: count(likes.userId),
      })
      .from(movies)
      .leftJoin(likes, eq(movies.id, likes.movieId))
      .groupBy(movies.id)
      .orderBy(movies.title);

    return res;
  }

  async getMovieById(id: string) {
    const [movie] = await this.db
      .select({
        id: movies.id,
        title: movies.title,
        description: movies.description,
        yearOfRelease: movies.yearOfRelease,
        likes: count(likes.userId),
      })
      .from(movies)
      .where(eq(movies.id, id))
      .leftJoin(likes, eq(movies.id, likes.movieId))
      .groupBy(movies.id);

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
    const [movie] = await this.db
      .update(movies)
      .set(updateData)
      .where(eq(movies.id, id))
      .returning();

    if (!movie) {
      return null;
    }

    return movie;
  }
}
