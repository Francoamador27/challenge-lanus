import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedDatabase } from "./seed-database";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const email = process.env.SEED_USER_EMAIL ?? "soygranate@clublanus.com";

try {
  const { movements } = await seedDatabase(db, {
    email,
    password: process.env.SEED_USER_PASSWORD ?? "GRANATE1@",
  });
  console.log(`Seeded ${movements} movements for ${email}`);
} finally {
  await db.$disconnect();
}
