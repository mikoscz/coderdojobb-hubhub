import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { movies } from "../drizzle/schema";
import * as schema from "../drizzle/schema";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";

const sqlite = new Database("hubhub.db");
const db = drizzle(sqlite, {schema });

export class MoviesService {
  async getAllMovies() {
    return db.select().from(movies);
  }


  async createMovie(
    movie: InferInsertModel<typeof movies>
  ): Promise<InferSelectModel<typeof movies>> {
    const [newMovie] = await db.insert(movies).values(movie).returning();
    return newMovie;
  }

  async getMovieById(id: string) {
   const [singleMovie] =  await db.select().from(movies).where(eq(movies.id, id) )

    // const m = db.query.movies.findFirst({
    //   where: eq(movies.id, id)
    // })

    if(!singleMovie) {
     return null;
   }

    return singleMovie;
  }

  async  deleteMovie(id: string) {
    console.log("id", id)
    return db.delete(movies).where(eq(movies.id, id));

  }

  async updateMovie(id: string, movie: InferInsertModel<typeof movies>) {
    return db.update(movies).set(movie).where(eq(movies.id, id)).returning();
  }

}
