import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const movies = sqliteTable("movies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  yearOfRelease: integer("yearOfRelease"),
  addedAt: text("added_at").default(sql`(CURRENT_TIMESTAMP)`),
});
