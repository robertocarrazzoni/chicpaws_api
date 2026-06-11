import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { createCategorySchema, updateCategorySchema } from "./categories.schemas";
import { createCategory, deleteCategory, listCategories, updateCategory } from "./categories.service";

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await listCategories();
  res.json({ categories });
});

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = createCategorySchema.parse(req.body);
  const category = await createCategory(payload);
  res.status(201).json({ category });
});

export const updateCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateCategorySchema.parse(req.body);
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const category = await updateCategory(id, payload);
  res.json({ category });
});

export const deleteCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteCategory(id);
  res.json(result);
});
