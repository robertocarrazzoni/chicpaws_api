import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { createProductSchema, productQuerySchema, updateProductSchema } from "./products.schemas";
import { adminListProducts, createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "./products.service";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);
  const result = await listProducts(query);
  res.json(result);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = await getProductById(id);
  res.json({ product });
});

export const getAdminProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);
  const result = await adminListProducts(query);
  res.json(result);
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = createProductSchema.parse(req.body);
  const product = await createProduct(payload);
  res.status(201).json({ product });
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateProductSchema.parse(req.body);
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = await updateProduct(id, payload);
  res.json({ product });
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = await deleteProduct(id);
  res.json({ product });
});
