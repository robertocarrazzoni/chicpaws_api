import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { createTestApp, getTestPrisma, resetDatabase } from "../helpers/test-app";

describe("Cart API", () => {
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
    expect(addItemResponse.body.cart.total).toBeCloseTo(119.8, 5);

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeader)
      .send({});

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.order.total).toBeCloseTo(119.8, 5);
  });

  it("permite atualizar e remover itens do carrinho", async () => {
    const prisma = await getTestPrisma();
    const category = await prisma.category.create({
      data: {
        name: "Brinquedos",
        slug: "brinquedos"
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
        name: "Bolinha",
        description: "Bolinha resistente para brincar.",
        sku: "SKU-BOLINHA",
        price: 19.9,
        stock: 6,
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
        quantity: 1
      });

    const itemId = addItemResponse.body.cart.items[0].id;

    const updateResponse = await request(app)
      .patch(`/api/v1/cart/items/${itemId}`)
      .set(authHeader)
      .send({
        quantity: 3
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.cart.items[0].quantity).toBe(3);
    expect(updateResponse.body.cart.total).toBeCloseTo(59.7, 5);

    const deleteResponse = await request(app)
      .delete(`/api/v1/cart/items/${itemId}`)
      .set(authHeader);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.cart.items).toHaveLength(0);
    expect(deleteResponse.body.cart.total).toBe(0);
  });
});
