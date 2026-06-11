import { Router } from "express";
import { createProductHandler, deleteProductHandler, getAdminProducts, getProduct, getProducts, updateProductHandler } from "./products.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";

export const productsRouter = Router();
export const adminProductsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);

adminProductsRouter.use(requireAuth, requireRole("ADMIN"));
adminProductsRouter.get("/", getAdminProducts);
adminProductsRouter.post("/", createProductHandler);
adminProductsRouter.patch("/:id", updateProductHandler);
adminProductsRouter.delete("/:id", deleteProductHandler);
