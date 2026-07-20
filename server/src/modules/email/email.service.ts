import { ResendService } from "./resend.service.js";
import { SendEmailOptions } from "./email.types.js";

class EmailService {
  private readonly provider = new ResendService();

  async sendEmail(options: SendEmailOptions): Promise<void> {
    await this.provider.sendEmail(options);
  }
}

export const emailService = new EmailService();
