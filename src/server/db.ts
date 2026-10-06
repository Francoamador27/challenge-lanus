import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getEnv } from "@/server/env";

const globalForDb = globalThis as unknown as { db?: PrismaClient };

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: getEnv().DATABASE_URL });
  return new PrismaClient({ adapter });
}

/** Shared Prisma client, reused across hot reloads outside production. */
export const db = globalForDb.db ?? createClient();

if (getEnv().NODE_ENV !== "production") {
  globalForDb.db = db;
}
