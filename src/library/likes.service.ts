import { likes, movies } from "../drizzle/schema";
import { Database } from "../common";
import { InferInsertModel, InferSelectModel, eq, and } from "drizzle-orm";

export class LikesService {
  constructor(private readonly db: Database) {}

  async addLikeToMovie(userId: string, movieId: string) {
    await this.db
      .insert(likes)
      .values({ userId, movieId })
      .onConflictDoNothing();

    return true;
  }

  async removeLikeFromMovie(userId: string, movieId: string) {
    await this.db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.movieId, movieId)));

    return true;
  }
}
