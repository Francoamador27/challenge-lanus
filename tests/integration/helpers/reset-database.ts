import { db } from "@/server/db";

/** Empties every application table so each test starts from a clean database. */
export async function resetDatabase(): Promise<void> {
  await db.$executeRaw`TRUNCATE TABLE "movements", "cards", "sessions", "users" CASCADE`;
}
