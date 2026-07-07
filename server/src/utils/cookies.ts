import { Response, CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite:
    (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") ?? "lax",
};

export const setRefreshTokenCookie = (
  res: Response,
  token: string,
): void => {
  res.cookie("refreshToken", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", cookieOptions);
};