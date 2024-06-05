export interface EmailProvider {
  sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void>;
}
