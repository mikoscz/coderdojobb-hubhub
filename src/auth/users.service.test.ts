import { describe, expect, test } from "vitest";
import { setupTestDb } from "../library/likes.service.test";
import { UsersService } from "./users.service";
import { MailerService } from "../common/mailer";
import { TestEmailProvider } from "../common/mailer/test-email-provider";

describe("UsersService", () => {
  describe("register", () => {
    test("sends and welcome email", async () => {
      const db = setupTestDb();
      const emailProvider = new TestEmailProvider();
      const service = new UsersService(db, new MailerService(emailProvider));

      await service.register({
        email: "test@test.com",
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
