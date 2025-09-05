// import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import type { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
const createToken = (payload: any, secret: any, expireTime: any): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime ?? "1d",
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
const decodedJWTToken = (token: string, secret: Secret): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    return null;
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  decodedJWTToken,
};
