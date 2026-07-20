import { Socket } from "socket.io";

import { verifyAccessToken } from "../utils/jwt.js";

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing."));
    }

    const decoded = verifyAccessToken(token) as JwtPayload;

    socket.data.user = {
      id: decoded.userId,
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
