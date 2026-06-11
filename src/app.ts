import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./config/openapi";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { categoriesRouter, adminCategoriesRouter } from "./modules/categories/categories.routes";
import { productsRouter, adminProductsRouter } from "./modules/products/products.routes";
import { ordersRouter, adminOrdersRouter } from "./modules/orders/orders.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "chicpaws-api"
    });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get("/api-docs.json", (_req, res) => res.json(openApiSpec));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/products", productsRouter);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/orders", ordersRouter);
  app.use("/api/v1/admin/products", adminProductsRouter);
  app.use("/api/v1/admin/categories", adminCategoriesRouter);
  app.use("/api/v1/admin/orders", adminOrdersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
