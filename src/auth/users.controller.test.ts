import { describe, expect, test } from "vitest";
import { build } from "../app";
import request from "supertest";
import { setupTestDb } from "../test/helpers";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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

    const [testUser] = await dbClient
      .select()
      .from(users)
      .where(eq(users.email, userInput.email));

    expect(testUser.email).toBe(userInput.email);
    expect(testUser.hashedPassword).not.toBe(userInput.password);
    expect(testUser.saltPassword).not.toBeNull();
    expect(testUser.hashedPassword).not.toBe(testUser.saltPassword);
  });
});
