import { Router } from "express";
import { addCartItem, fetchCart, removeCartItemHandler, updateCartItemHandler } from "./cart.controller";
import { requireAuth } from "../../middlewares/auth";

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get("/", fetchCart);
cartRouter.post("/items", addCartItem);
cartRouter.patch("/items/:id", updateCartItemHandler);
cartRouter.delete("/items/:id", removeCartItemHandler);
