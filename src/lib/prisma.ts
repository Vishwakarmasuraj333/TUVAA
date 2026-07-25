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

let dbOfflineUntil = 0;

/**
 * Fast check to determine if MySQL database server is online and reachable.
 * Uses a 30-second circuit-breaker to prevent 10-second TCP timeouts on every query when DB is down.
 */
export async function isDbAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now < dbOfflineUntil) {
    return false;
  }
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 1000)),
    ]);
    return true;
  } catch {
    dbOfflineUntil = Date.now() + 30000; // Skip DB queries for 30s if offline
    return false;
  }
}
