import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/api-error.js";

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is missing.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token) as JwtPayload;

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    throw new ApiError(401, "Invalid or expired access token.");
  }
};