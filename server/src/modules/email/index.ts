export { emailService } from "./email.service.js";

export {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
  groupInvitationEmailTemplate,
} from "./email.templates.js";

export type { EmailProvider, SendEmailOptions } from "./email.types.js";
