import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { authService } from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../utils/cookies.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const {
      user,
      accessToken,
      refreshToken,
      verificationToken,
    } = await authService.register(data);

    setRefreshTokenCookie(res, refreshToken);

    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user,
        accessToken,
        verificationUrl,
      },
    });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token;

    if (typeof token !== "string") {
      throw new ApiError(400, "Verification token is required.");
    }

    const user = await authService.verifyEmail(token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: {
        user,
      },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } =
      await authService.login(data);

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
        accessToken,
      },
    });
  }),

  forgotPassword: asyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);

    const result = await authService.forgotPassword(data);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a password reset link has been sent.",
      data: result
        ? {
            resetUrl: `http://localhost:5173/reset-password?token=${result.resetToken}`,
          }
        : {},
    });
  },
),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is missing.");
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refresh(refreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        accessToken,
      },
    });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    authService.logout();

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }),

  resetPassword: asyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  },
),

};