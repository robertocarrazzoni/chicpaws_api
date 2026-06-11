import { Router } from "express";
import { adminOrders, checkout, getOrder, myOrders } from "./orders.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";

export const ordersRouter = Router();
export const adminOrdersRouter = Router();

ordersRouter.use(requireAuth);
ordersRouter.post("/checkout", checkout);
ordersRouter.get("/me", myOrders);
ordersRouter.get("/:id", getOrder);

adminOrdersRouter.use(requireAuth, requireRole("ADMIN"));
adminOrdersRouter.get("/", adminOrders);
