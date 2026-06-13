import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { createTestApp, getTestPrisma, resetDatabase } from "../helpers/test-app";

describe("Products API", () => {
  let app: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    const prisma = await getTestPrisma();
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    const prisma = await getTestPrisma();
    await prisma.$disconnect();
  });

  async function createAdminToken() {
    const prisma = await getTestPrisma();
    const adminPassword = await bcrypt.hash("Password@123", 10);

    await prisma.user.upsert({
      where: { email: "admin@chicpaws.com" },
      update: { password: adminPassword, role: "ADMIN" },
      create: {
        name: "Admin",
        email: "admin@chicpaws.com",
        password: adminPassword,
        role: "ADMIN",
        cart: {
          create: {}
        }
      }
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@chicpaws.com",
        password: "Password@123"
      });

    return { prisma, token: loginResponse.body.token };
  }

  it("lista produtos públicos", async () => {
    const prisma = await getTestPrisma();
    const category = await prisma.category.create({
      data: {
        name: "Rações",
        slug: "racoes"
      }
    });

    const product = await prisma.product.create({
      data: {
        name: "Ração Premium",
        description: "Ração premium para cães adultos.",
        sku: "SKU-001",
        price: 120,
        stock: 20,
        categoryId: category.id
      }
    });

    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe(product.id);
  });

  it("permite atualizar e excluir produtos como admin", async () => {
    const { prisma, token } = await createAdminToken();
    const category = await prisma.category.create({
      data: {
        name: "Banho e Tosa",
        slug: "banho-e-tosa"
      }
    });
    const product = await prisma.product.create({
      data: {
        name: "Shampoo Pet",
        description: "Shampoo suave para cães.",
        sku: "SKU-SHAMPOO",
        price: 39.9,
        stock: 8,
        categoryId: category.id
      }
    });

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Shampoo Pet Premium",
        price: 49.9,
        stock: 10
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.product.name).toBe("Shampoo Pet Premium");
    expect(updateResponse.body.product.price).toBe(49.9);
    expect(updateResponse.body.product.stock).toBe(10);

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.product.isActive).toBe(false);

    const listResponse = await request(app).get("/api/v1/products");
    expect(listResponse.body.items).toHaveLength(0);
  });
});
