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

export async function updateCurrentUser(
  userId: string,
  input: { name?: string; email?: string; password?: string }
) {
  const prisma = getPrisma();
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!currentUser) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  if (input.email) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });

    if (existing && existing.id !== userId) {
      throw new HttpError(409, "E-mail já cadastrado.");
    }
  }

  const data: { name?: string; email?: string; password?: string } = {};

  if (input.name) {
    data.name = input.name;
  }

  if (input.email) {
    data.email = input.email;
  }

  if (input.password) {
    data.password = await hashPassword(input.password);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return {
    user,
    token: buildToken(user)
  };
}

export async function deleteCurrentUser(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          orders: true
        }
      }
    }
  });

  if (!user) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  if (user._count.orders > 0) {
    throw new HttpError(409, "Não é possível excluir um usuário com pedidos vinculados.");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: "Usuário removido com sucesso." };
}
