import { authRepository } from "./auth.repository.js";
import { verificationTokenRepository } from "./verification-token.repository.js";
import { passwordResetTokenRepository } from "./password-reset-token.repository.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { generateToken, hashToken } from "../../utils/token.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/api-error.js";
import { emailQueue } from "../../jobs/email.queue.js";
import type { Profile } from "passport-google-oauth20";

import {
  ForgotPasswordInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
  ResendVerificationInput,
} from "./auth.types.js";

import type { JwtPayload } from "jsonwebtoken";

export const authService = {
  async register(data: RegisterUserInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists.");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const rawVerificationToken = generateToken();
    const hashedVerificationToken = hashToken(rawVerificationToken);

    await verificationTokenRepository.upsert({
      userId: user.id,
      token: hashedVerificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawVerificationToken}`;

    await emailQueue.add(
      "send-verification-email",
      {
        email: user.email,
        name: user.name,
        verificationUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      }
    );

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  async verifyEmail(token: string) {
    const hashedToken = hashToken(token);

    const verificationToken = await verificationTokenRepository.findByToken(hashedToken);

    if (!verificationToken) {
      throw new ApiError(400, "Invalid verification token.");
    }

    if (verificationToken.expiresAt < new Date()) {
      await verificationTokenRepository.deleteById(verificationToken.id);

      throw new ApiError(400, "Verification token has expired.");
    }

    const user = await authRepository.verifyEmail(verificationToken.userId);

    await verificationTokenRepository.deleteById(verificationToken.id);

    return user;
  },

  async resendVerification(data: ResendVerificationInput) {
    const user = await authRepository.findUserByEmail(data.email);

    // Prevent email enumeration
    if (!user) {
      return;
    }

    if (user.emailVerified) {
      return;
    }

    const rawVerificationToken = generateToken();
    const hashedVerificationToken = hashToken(rawVerificationToken);

    await verificationTokenRepository.upsert({
      userId: user.id,
      token: hashedVerificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawVerificationToken}`;

    await emailQueue.add(
      "send-verification-email",
      {
        email: user.email,
        name: user.name,
        verificationUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      }
    );

    return;
  },

  async login(data: LoginUserInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(data.password, user.password!);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const { password: _password, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },
  async googleLogin(profile: Profile) {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new ApiError(400, "Google account does not have an email.");
    }

    const avatarUrl = profile.photos?.[0]?.value ?? null;

    // Existing Google account
    let user = await authRepository.findUserByGoogleId(googleId);

    if (!user) {
      // Existing local account
      const existingUser = await authRepository.findUserByEmail(email);

      if (existingUser) {
        user = await authRepository.linkGoogleAccount(existingUser.id, googleId, avatarUrl);
      } else {
        // Brand new Google account
        user = await authRepository.createGoogleUser({
          email,
          googleId,
          name: profile.displayName,
          avatarUrl,
        });
      }
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  },
  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const accessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout() {
    return;
  },
  async forgotPassword(data: ForgotPasswordInput) {
    const user = await authRepository.findUserByEmail(data.email);

    // Prevent email enumeration
    if (!user) {
      return;
    }

    // Remove any existing unused reset tokens
    await passwordResetTokenRepository.deleteUnusedByUserId(user.id);

    // Generate raw token and hash it
    const rawResetToken = generateToken();
    const hashedResetToken = hashToken(rawResetToken);

    // Store hashed token
    await passwordResetTokenRepository.create({
      userId: user.id,
      token: hashedResetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawResetToken}`;

    await emailQueue.add(
      "send-password-reset-email",
      {
        email: user.email,
        name: user.name,
        resetUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      }
    );

    return;
  },

  async resetPassword(data: ResetPasswordInput) {
    const hashedToken = hashToken(data.token);
    const hashedPassword = await hashPassword(data.password);
    const passwordResetToken = await passwordResetTokenRepository.findByToken(hashedToken);

    if (!passwordResetToken) {
      throw new ApiError(400, "Invalid password reset token.");
    }

    if (passwordResetToken.usedAt) {
      throw new ApiError(400, "Password reset token has already been used.");
    }

    if (passwordResetToken.expiresAt < new Date()) {
      throw new ApiError(400, "Password reset token has expired.");
    }

    await authRepository.updateUserPassword(passwordResetToken.userId, hashedPassword);

    await passwordResetTokenRepository.markAsUsed(passwordResetToken.id);

    const user = await authRepository.findUserById(passwordResetToken.userId);

    if (user) {
      await emailQueue.add(
        "send-password-changed-email",
        {
          email: user.email,
          name: user.name,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: 100,
          removeOnFail: 100,
        }
      );
    }
  },
};
