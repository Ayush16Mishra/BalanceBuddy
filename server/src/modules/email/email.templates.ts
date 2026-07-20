export function verificationEmailTemplate(name: string, verificationUrl: string): string {
  return `
    <h2>Welcome to BalanceBuddy!</h2>

    <p>Hi ${name},</p>

    <p>Thanks for signing up. Please verify your email by clicking the button below.</p>

    <p>
      <a
        href="${verificationUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#7c3aed;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Verify Email
      </a>
    </p>

    <p>If you didn't create this account, you can safely ignore this email.</p>
  `;
}

export function resetPasswordEmailTemplate(name: string, resetUrl: string): string {
  return `
    <h2>Password Reset</h2>

    <p>Hi ${name},</p>

    <p>Click the button below to reset your password.</p>

    <p>
      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#dc2626;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>
    </p>

    <p>If you didn't request this, you can ignore this email.</p>
  `;
}

export function groupInvitationEmailTemplate(
  inviterName: string,
  groupName: string,
  inviteUrl: string
): string {
  return `
    <h2>You're Invited!</h2>

    <p>${inviterName} invited you to join <strong>${groupName}</strong>.</p>

    <p>
      <a
        href="${inviteUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Join Group
      </a>
    </p>
  `;
}

export function passwordChangedEmailTemplate(name: string): string {
  return `
    <h2>Password Changed Successfully</h2>

    <p>Hi ${name},</p>

    <p>Your BalanceBuddy password has been changed successfully.</p>

    <p>If you made this change, you don't need to do anything else.</p>

    <p>
      <strong>
        If you did not change your password, please reset your password immediately
        and contact support.
      </strong>
    </p>

    <p>— The BalanceBuddy Team</p>
  `;
}
