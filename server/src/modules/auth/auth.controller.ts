import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { authService } from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../../utils/cookies.js";
import { asyncHandler } from "../../utils/async-handler.js";
import type { Profile } from "passport-google-oauth20";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await authService.register(data);

    setRefreshTokenCookie(res, refreshToken);
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user,
        accessToken,
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

  resendVerification: asyncHandler(async (req: Request, res: Response) => {
    const data = resendVerificationSchema.parse(req.body);

    await authService.resendVerification(data);

    return res.status(200).json({
      success: true,
      message:
        "If your account exists and is not yet verified, a new verification email has been sent.",
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await authService.login(data);

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

  googleCallback: asyncHandler(async (req: Request, res: Response) => {
    const profile = req.user as Profile | undefined;

    if (!profile) {
      throw new ApiError(401, "Google authentication failed.");
    }

    const { user: _user, accessToken, refreshToken } = await authService.googleLogin(profile);

    setRefreshTokenCookie(res, refreshToken);

    const redirectUrl = new URL(process.env.GOOGLE_SUCCESS_REDIRECT!);

    redirectUrl.searchParams.set("accessToken", accessToken);

    return res.redirect(redirectUrl.toString());
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(data);

    return res.status(200).json({
      success: true,
      message: "If an account exists, a password reset link has been sent.",
      data: {},
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is missing.");
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

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

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  }),
};
