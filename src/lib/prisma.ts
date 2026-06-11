import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { env } from "../config/env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function getPrisma() {
  const globalPrisma = globalThis as typeof globalThis & { __prisma?: PrismaClient };

  if (!globalPrisma.__prisma) {
    const adapter = new PrismaLibSql({ url: env.DATABASE_URL });

    globalPrisma.__prisma = new PrismaClient({ adapter });
  }

  return globalPrisma.__prisma;
}

export async function disconnectPrisma() {
  const globalPrisma = globalThis as typeof globalThis & { __prisma?: PrismaClient };

  if (globalPrisma.__prisma) {
    await globalPrisma.__prisma.$disconnect();
    globalPrisma.__prisma = undefined;
  }
}
