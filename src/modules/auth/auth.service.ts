import { getPrisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import { comparePassword, hashPassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

function buildToken(user: { id: string; email: string; name: string; role: string }) {
  return signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}

function publicUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new HttpError(409, "E-mail já cadastrado.");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
      role: "CUSTOMER",
      cart: {
        create: {}
      }
    }
  });

  return {
    user: publicUser(user),
    token: buildToken(user)
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  const isValid = await comparePassword(input.password, user.password);

  if (!isValid) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  return {
    user: publicUser(user),
    token: buildToken(user)
  };
}

export async function getCurrentUser(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  return user;
}
