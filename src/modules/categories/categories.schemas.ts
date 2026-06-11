import { z } from "zod";
import { slugify } from "../../utils/slugify";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export function categorySlugFromName(name: string) {
  return slugify(name);
}
