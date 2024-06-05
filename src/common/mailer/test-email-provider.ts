import { EmailProvider } from "./email-provider";

type ReceivedEmail = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export class TestEmailProvider implements EmailProvider {
  inbox: ReceivedEmail[] = [];

  async sendEmail(email: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    this.inbox.push(email);
  }

  get lastEmail(): ReceivedEmail {
    return this.inbox[this.inbox.length - 1];
  }

  get inboxSize(): number {
    return this.inbox.length;
  }
}
