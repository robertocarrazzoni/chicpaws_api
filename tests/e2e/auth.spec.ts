import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { createTestApp, getTestPrisma, resetDatabase } from "../helpers/test-app";

describe("Auth API", () => {
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

  it("registra, autentica e acessa o perfil", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Cliente Teste",
        email: "cliente@teste.com",
        password: "Password@123"
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "cliente@teste.com",
        password: "Password@123"
      });

    expect(loginResponse.status).toBe(200);

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe("cliente@teste.com");
  });

  it("permite atualizar o próprio usuário", async () => {
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

    const updateResponse = await request(app)
      .patch("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send({
        name: "Cliente Atualizado",
        email: "cliente.novo@teste.com",
        password: "NovaSenha@123"
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.user.name).toBe("Cliente Atualizado");
    expect(updateResponse.body.user.email).toBe("cliente.novo@teste.com");
    expect(updateResponse.body.token).toBeTruthy();

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${updateResponse.body.token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.name).toBe("Cliente Atualizado");
    expect(meResponse.body.user.email).toBe("cliente.novo@teste.com");

    const reloginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "cliente.novo@teste.com",
        password: "NovaSenha@123"
      });

    expect(reloginResponse.status).toBe(200);
  });

  it("permite excluir o próprio usuário", async () => {
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

    const deleteResponse = await request(app)
      .delete("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Usuário removido com sucesso.");

    const reloginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "Password@123"
      });

    expect(reloginResponse.status).toBe(401);
  });
});
