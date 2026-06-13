import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { loginSchema, registerSchema, updateUserSchema } from "./auth.schemas";
import { deleteCurrentUser, getCurrentUser, loginUser, registerUser, updateCurrentUser } from "./auth.service";

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

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateUserSchema.parse(req.body);
  const result = await updateCurrentUser(req.user!.id, payload);
  res.json(result);
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteCurrentUser(req.user!.id);
  res.json(result);
});
