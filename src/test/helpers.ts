import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { Database as DatabaseType} from "../common";

export function setupTestDb() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });

  migrate(db, { migrationsFolder: "drizzle" });

  return { dbClient: db, db: sqlite };
}

export async function signInAs(db: DatabaseType, email: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if(!user) {
    const user = {
      id: uuid(),
      email:  email,
      firstName: "Jan",
      lastName: "Kowalski",
      hashedPassword: "password",
      saltPassword: "salt",
    }

    const [newUser] = await db.insert(schema.users).values(user).returning();

    return jwt.sign({ id: newUser.id }, process.env.SECRET);
  }
  return jwt.sign({ id: user.id }, process.env.SECRET);
}