import { z } from "zod";

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  categoryId: z.string().optional()
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().min(10).max(1000),
  sku: z.string().min(3).max(50),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().min(1)
});

export const updateProductSchema = createProductSchema.partial();
