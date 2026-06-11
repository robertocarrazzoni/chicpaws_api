import { PrismaClient } from "@prisma/client";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "change-me-now-please-32-chars-min";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./prisma/test.db";

export async function createTestApp() {
  const { createApp } = await import("../../src/app");
  return createApp();
}

export async function getTestPrisma() {
  const { getPrisma } = await import("../../src/lib/prisma");
  return getPrisma();
}

export async function resetDatabase(prisma: PrismaClient) {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}
