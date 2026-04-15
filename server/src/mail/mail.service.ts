import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

export type SendMailInput = {
  email: string;
  subject: string;
  message: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendEmail({ email, subject, message }: SendMailInput): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message,
    });

    this.logger.log(`Email sent to ${email}`);
  }
}
