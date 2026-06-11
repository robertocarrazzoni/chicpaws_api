import { getPrisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";

export async function listProducts(input: { page: number; limit: number; categoryId?: string }) {
  const prisma = getPrisma();
  const skip = (input.page - 1) * input.limit;
  const where = {
    isActive: true,
    ...(input.categoryId ? { categoryId: input.categoryId } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: input.limit
    }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    page: input.page,
    limit: input.limit,
    total
  };
}

export async function getProductById(id: string) {
  const prisma = getPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product || !product.isActive) {
    throw new HttpError(404, "Produto não encontrado.");
  }

  return product;
}

export async function adminListProducts(input: { page: number; limit: number; categoryId?: string }) {
  const prisma = getPrisma();
  const skip = (input.page - 1) * input.limit;
  const where = {
    ...(input.categoryId ? { categoryId: input.categoryId } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: input.limit
    }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    page: input.page,
    limit: input.limit,
    total
  };
}

export async function createProduct(input: {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}) {
  const prisma = getPrisma();
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

  if (!category) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  return prisma.product.create({
    data: input,
    include: { category: true }
  });
}

export async function updateProduct(id: string, input: Partial<{
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  isActive: boolean;
}>) {
  const prisma = getPrisma();
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new HttpError(404, "Produto não encontrado.");
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new HttpError(404, "Categoria não encontrada.");
    }
  }

  return prisma.product.update({
    where: { id },
    data: input,
    include: { category: true }
  });
}

export async function deleteProduct(id: string) {
  const prisma = getPrisma();
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new HttpError(404, "Produto não encontrado.");
  }

  return prisma.product.update({
    where: { id },
    data: { isActive: false }
  });
}
