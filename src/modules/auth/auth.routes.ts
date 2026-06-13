import { Router } from "express";
import { deleteMe, login, me, register, updateMe } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/me", requireAuth, updateMe);
authRouter.delete("/me", requireAuth, deleteMe);
