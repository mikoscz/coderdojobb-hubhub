import nodemailer from "nodemailer"

export interface IEmailProvider {
    sendEmial(params: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html: string;
    }): Promise<void>;
}

class EmailProvider implements IEmailProvider {
    async sendEmial(params: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html: string;
    }): Promise<void> {
        Promise.resolve();
    }
 
}