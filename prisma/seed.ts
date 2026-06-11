import bcrypt from "bcryptjs";
import { getPrisma } from "../src/lib/prisma";
import { slugify } from "../src/utils/slugify";

async function main() {
  const prisma = getPrisma();
  const password = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@chicpaws.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@chicpaws.com",
      password,
      role: "ADMIN",
      cart: {
        create: {}
      }
    }
  });

  await prisma.user.upsert({
    where: { email: "cliente@chicpaws.com" },
    update: {},
    create: {
      name: "Cliente",
      email: "cliente@chicpaws.com",
      password,
      role: "CUSTOMER",
      cart: {
        create: {}
      }
    }
  });

  const categories = [
    { name: "Rações", description: "Alimentação para pets" },
    { name: "Acessórios", description: "Itens essenciais e estilosos" },
    { name: "Higiene", description: "Produtos de limpeza e cuidado" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        description: category.description
      },
      create: {
        name: category.name,
        slug: slugify(category.name),
        description: category.description
      }
    });
  }

  const food = await prisma.category.findUniqueOrThrow({ where: { slug: "racoes" } });
  const accessories = await prisma.category.findUniqueOrThrow({ where: { slug: "acessorios" } });

  const products = [
    {
      name: "Ração Premium 15kg",
      sku: "RAC-15KG-001",
      description: "Ração completa para cães adultos.",
      price: 189.9,
      stock: 30,
      categoryId: food.id
    },
    {
      name: "Coleira Ajustável",
      sku: "COL-ADJ-001",
      description: "Coleira resistente e confortável.",
      price: 39.9,
      stock: 80,
      categoryId: accessories.id
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: {
        ...product,
        isActive: true
      }
    });
  }

  console.log(`Seed concluído. Admin: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    const prisma = getPrisma();
    await prisma.$disconnect();
  });
