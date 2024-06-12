import { describe, expect, test } from "vitest";
import { UsersService } from "./users.service";
import { MailerService } from "../common/mailer";
import { TestEmailProvider } from "../common/mailer/test-email-provider";
import { setupTestDb } from "../test/helpers";

describe("UsersService", () => {
  describe("register", () => {
    test("sends and welcome email", async () => {
      const { dbClient } = setupTestDb();
      const emailProvider = new TestEmailProvider();
      const service = new UsersService(
        dbClient,
        new MailerService(emailProvider)
      );

      await service.register({
        email: "test@test.com",
        password: "ala",
      });

      expect(emailProvider.inboxSize).toBe(1);
      expect(emailProvider.lastEmail).toMatchObject({
        to: "test@test.com",
        from: "noreply@hubhub.com",
        subject: "Welcome to HubHub!",
        text: "Welcome to HubHub! We're excited to have you on board.",
      });
    });
  });
});
