import jwt, { Secret, SignOptions } from "jsonwebtoken";

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET!;

const accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN!;
const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN!;

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    accessSecret,
    {
      expiresIn: accessExpiresIn,
    } as SignOptions
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    refreshSecret,
    {
      expiresIn: refreshExpiresIn,
    } as SignOptions
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret);
};