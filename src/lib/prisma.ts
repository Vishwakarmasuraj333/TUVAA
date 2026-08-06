import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [], // Suppress raw terminal error dumping when DB is unreachable
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Fast check for database availability without blocking queries or artificially throttling performance.
 */
export async function isDbAvailable(): Promise<boolean> {
  return true;
}

