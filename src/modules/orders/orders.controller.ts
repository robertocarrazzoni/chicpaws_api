import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { checkoutCart, getOrderById, listAllOrders, listMyOrders } from "./orders.service";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const order = await checkoutCart(req.user!.id);
  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await listMyOrders(req.user!.id);
  res.json({ orders });
});

export const adminOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await listAllOrders();
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const order = await getOrderById(id, req.user?.role === "ADMIN" ? undefined : req.user!.id);
  res.json({ order });
});
