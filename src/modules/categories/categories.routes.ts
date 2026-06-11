import { Router } from "express";
import { createCategoryHandler, deleteCategoryHandler, getCategories, updateCategoryHandler } from "./categories.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";

export const categoriesRouter = Router();
export const adminCategoriesRouter = Router();

categoriesRouter.get("/", getCategories);

adminCategoriesRouter.use(requireAuth, requireRole("ADMIN"));
adminCategoriesRouter.post("/", createCategoryHandler);
adminCategoriesRouter.patch("/:id", updateCategoryHandler);
adminCategoriesRouter.delete("/:id", deleteCategoryHandler);
