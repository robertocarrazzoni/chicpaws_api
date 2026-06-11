import { getPrisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import { slugify } from "../../utils/slugify";

export async function listCategories() {
  const prisma = getPrisma();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } }
    }
  });
}

export async function createCategory(input: { name: string; description?: string }) {
  const prisma = getPrisma();
  return prisma.category.create({
    data: {
      name: input.name,
      slug: slugify(input.name),
      description: input.description
    }
  });
}

export async function updateCategory(id: string, input: { name?: string; description?: string }) {
  const prisma = getPrisma();
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  const data = {
    ...input,
    ...(input.name ? { slug: slugify(input.name) } : {})
  };

  return prisma.category.update({
    where: { id },
    data
  });
}

export async function deleteCategory(id: string) {
  const prisma = getPrisma();
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } }
  });

  if (!category) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  if (category._count.products > 0) {
    throw new HttpError(409, "Não é possível excluir uma categoria com produtos vinculados.");
  }

  await prisma.category.delete({ where: { id } });
  return { message: "Categoria removida com sucesso." };
}
