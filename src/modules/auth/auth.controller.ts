import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { registerSchema, loginSchema } from "./auth.schemas";
import { getCurrentUser, loginUser, registerUser } from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const result = await registerUser(payload);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);
  res.status(200).json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);
  res.json({ user });
});
