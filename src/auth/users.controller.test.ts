import { describe, expect, test } from "vitest";
import { build } from "../app";
import request from "supertest";
import { setupTestDb } from "../test/helpers";

describe("UsersController", () => {
  test("POST /sing-up", async () => {
    const { dbClient, db } = setupTestDb();

    const app = build({
      db,
    });

    const userInput = {
      email: "poprawneHaslo@makka999.pl",
      password: "ZAQ!2wsx",
    };

    await request(app).post("/sign-up").send(userInput).expect(201);

    // expect(response.body).toMatchObject({})

    //await db.insert(movies).values(sampleMovies);

    //  const [testUser] = await db.select().from(schema.users).where(eq(schema.users.email, userInput.email));

    // expect(testUser.email).toBe(userInput.email)
    // expect(testUser.hashedPassword).not.toBe(userInput.password)
    // expect(testUser.saltPassword).not.toBeNull();
  });
});
