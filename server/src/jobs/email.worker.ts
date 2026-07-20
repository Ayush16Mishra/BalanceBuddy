import { Worker } from "bullmq";

import { bullConnection } from "./connection.js";
import { emailService } from "../modules/email/email.service.js";
import {
  groupInvitationEmailTemplate,
  passwordChangedEmailTemplate,
  resetPasswordEmailTemplate,
  verificationEmailTemplate,
} from "../modules/email/email.templates.js";

export const emailWorker = new Worker(
  "emails",
  async (job) => {
    switch (job.name) {
      case "send-verification-email": {
        const { email, name, verificationUrl } = job.data;

        await emailService.sendEmail({
          to: email,
          subject: "Verify your BalanceBuddy account",
          html: verificationEmailTemplate(name, verificationUrl),
        });

        break;
      }

      case "send-password-reset-email": {
        const { email, name, resetUrl } = job.data;

        await emailService.sendEmail({
          to: email,
          subject: "Reset your BalanceBuddy password",
          html: resetPasswordEmailTemplate(name, resetUrl),
        });

        break;
      }

      case "send-password-changed-email": {
        const { email, name } = job.data;

        await emailService.sendEmail({
          to: email,
          subject: "Your BalanceBuddy password was changed",
          html: passwordChangedEmailTemplate(name),
        });

        break;
      }

      case "send-group-invitation-email": {
        const { email, inviterName, groupName, inviteUrl } = job.data;

        await emailService.sendEmail({
          to: email,
          subject: `You're invited to join ${groupName}`,
          html: groupInvitationEmailTemplate(inviterName, groupName, inviteUrl),
        });

        break;
      }

      default:
        throw new Error(`Unknown email job: ${job.name}`);
    }
  },
  {
    connection: bullConnection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`❌ Email job ${job?.id} failed`, error);
});
