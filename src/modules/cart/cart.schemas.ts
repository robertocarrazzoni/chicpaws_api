import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive()
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive()
});
