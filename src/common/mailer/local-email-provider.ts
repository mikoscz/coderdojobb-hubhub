import nodemailer from "nodemailer";
import { EmailProvider } from "./email-provider";

export class LocalEmailProvider implements EmailProvider {
  transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
  });

  async sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    this.transporter.sendMail({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
  }
}
