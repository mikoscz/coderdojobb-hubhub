import { EmailProvider } from "./email-provider";

export class MailerService {
  constructor(private readonly provider: EmailProvider) {}

  async sendEmail(email: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    await this.provider.sendEmail({
      to: email.to,
      from: "noreply@hubhub.com",
      subject: email.subject,
      text: email.text,
      html: `<p>${email.text}</p>`,
    });
  }
}
