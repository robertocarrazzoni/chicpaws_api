import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { addCartItemSchema, updateCartItemSchema } from "./cart.schemas";
import { addItemToCart, getCart, removeCartItem, updateCartItem } from "./cart.service";

export const fetchCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getCart(req.user!.id);
  res.json({ cart });
});

export const addCartItem = asyncHandler(async (req: Request, res: Response) => {
  const payload = addCartItemSchema.parse(req.body);
  const cart = await addItemToCart(req.user!.id, payload);
  res.status(201).json({ cart });
});

export const updateCartItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateCartItemSchema.parse(req.body);
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cart = await updateCartItem(req.user!.id, itemId, payload.quantity);
  res.json({ cart });
});

export const removeCartItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cart = await removeCartItem(req.user!.id, itemId);
  res.json({ cart });
});
