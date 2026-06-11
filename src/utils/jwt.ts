import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
