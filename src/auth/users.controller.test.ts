import { expect, test } from "vitest";
//import { setupTestDb } from "./movies.service.test";
import { build } from "../app";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { movies } from "../drizzle/schema";
import request from "supertest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { setupTestDb } from "../library/likes.service.test";
import { eq } from "drizzle-orm";



test("POST /sing-up", async () => {
  const app = build({
    dbUrl: ":memory:",
  });

  const db = setupTestDb();

  migrate(db, { migrationsFolder: "drizzle" });

  const userInput = 
    {
        email : "poprawneHaslo@makka999.pl",
        password: "ZAQ!2wsx"
    }
    

const response = await request(app)
.post("/sign-up")
.send(userInput)
.expect(201);

  //await db.insert(movies).values(sampleMovies);

 const [testUser] = await db.select().from(schema.users).where(eq(schema.users.email, userInput.email));

expect(testUser.email).toBe(userInput.email)
expect(testUser.hashedPassword).not.toBe(userInput.password)
expect(testUser.saltPassword).not.toBeNull();

});