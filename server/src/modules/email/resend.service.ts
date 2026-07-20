import { Resend } from "resend";

import { EmailProvider, SendEmailOptions } from "./email.types.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendService implements EmailProvider {
  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });
  }
}
