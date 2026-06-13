import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { createTestApp, getTestPrisma, resetDatabase } from "../helpers/test-app";

describe("Categories API", () => {
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

  it("lista categorias públicas", async () => {
    const prisma = await getTestPrisma();
    await prisma.category.create({
      data: {
        name: "Rações",
        slug: "racoes"
      }
    });

    const response = await request(app).get("/api/v1/categories");

    expect(response.status).toBe(200);
    expect(response.body.categories).toHaveLength(1);
  });

  it("permite atualizar e excluir categorias como admin", async () => {
    const { prisma, token } = await createAdminToken();
    const category = await prisma.category.create({
      data: {
        name: "Higiene",
        slug: "higiene",
        description: "Itens de limpeza"
      }
    });

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Higiene Pet",
        description: "Itens de limpeza para pets"
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.category.name).toBe("Higiene Pet");
    expect(updateResponse.body.category.slug).toBe("higiene-pet");
    expect(updateResponse.body.category.description).toBe("Itens de limpeza para pets");

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Categoria removida com sucesso.");

    const categoriesResponse = await request(app).get("/api/v1/categories");
    expect(categoriesResponse.body.categories).toHaveLength(0);
  });
});
