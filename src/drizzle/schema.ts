import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString()),
};

export const movies = sqliteTable("movies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  yearOfRelease: integer("yearOfRelease"),
  addedAt: text("added_at").default(sql`(CURRENT_TIMESTAMP)`),
  ...timestamps,
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  saltPassword: text("salt_password").notNull(),
  ...timestamps,
});

export const likes = sqliteTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.movieId] }),
    };
  }
);
