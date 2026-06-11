import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import { createTestApp, getTestPrisma, resetDatabase } from "../helpers/test-app";
import bcrypt from "bcryptjs";

describe("API de ecommerce", () => {
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

  it("registra, autentica e acessa catálogo", async () => {
    const prisma = await getTestPrisma();
    const adminPassword = await bcrypt.hash("Password@123", 10);
    const category = await prisma.category.create({
      data: {
        name: "Rações",
        slug: "racoes"
      }
    });

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Cliente Teste",
        email: "cliente@teste.com",
        password: "Password@123"
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();

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

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "cliente@teste.com",
        password: "Password@123"
      });

    expect(loginResponse.status).toBe(200);

    const productsResponse = await request(app).get("/api/v1/products");
    expect(productsResponse.status).toBe(200);
    expect(productsResponse.body.items).toHaveLength(1);
    expect(productsResponse.body.items[0].id).toBe(product.id);

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe("cliente@teste.com");
  });

  it("permite carrinho e checkout", async () => {
    const prisma = await getTestPrisma();
    const category = await prisma.category.create({
      data: {
        name: "Acessórios",
        slug: "acessorios"
      }
    });

    const user = await prisma.user.create({
      data: {
        name: "Cliente",
        email: "cliente@teste.com",
        password: await bcrypt.hash("Password@123", 10),
        role: "CUSTOMER",
        cart: { create: {} }
      }
    });

    const product = await prisma.product.create({
      data: {
        name: "Coleira",
        description: "Coleira ajustável.",
        sku: "SKU-COLEIRA",
        price: 59.9,
        stock: 5,
        categoryId: category.id
      }
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "Password@123"
      });

    const authHeader = { Authorization: `Bearer ${loginResponse.body.token}` };

    const addItemResponse = await request(app)
      .post("/api/v1/cart/items")
      .set(authHeader)
      .send({
        productId: product.id,
        quantity: 2
      });

    expect(addItemResponse.status).toBe(201);
    expect(addItemResponse.body.cart.total).toBe(119.8);

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeader)
      .send({});

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.order.total).toBe(119.8);
  });

  it("bloqueia rotas administrativas para cliente", async () => {
    const prisma = await getTestPrisma();
    const user = await prisma.user.create({
      data: {
        name: "Cliente",
        email: "cliente@teste.com",
        password: await bcrypt.hash("Password@123", 10),
        role: "CUSTOMER",
        cart: { create: {} }
      }
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "Password@123"
      });

    const forbiddenResponse = await request(app)
      .get("/api/v1/admin/products")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(forbiddenResponse.status).toBe(403);
  });
});
