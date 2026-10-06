import { beforeEach, describe, expect, it } from "vitest";
import { verifyPassword } from "@/server/auth/password";
import { db } from "@/server/db";
import { SEED_MOVEMENTS } from "../../prisma/seed-data";
import { seedDatabase } from "../../prisma/seed-database";
import { resetDatabase } from "./helpers/reset-database";

const CREDENTIALS = { email: "SoyGranate@ClubLanus.com ", password: "GRANATE1@" };

describe("seedDatabase", () => {
  beforeEach(resetDatabase);

  it("creates the demo user with a hashed password, two cards and every movement", async () => {
    await seedDatabase(db, CREDENTIALS);
    const user = await db.user.findUniqueOrThrow({
      where: { email: "soygranate@clublanus.com" },
      include: { cards: true, _count: { select: { movements: true } } },
    });
    expect(user.displayName).toBe("Granate");
    expect(await verifyPassword(user.passwordHash, "GRANATE1@")).toBe(true);
    expect(user.cards.map((card) => card.last4).sort()).toEqual(["1234", "5678"]);
    expect(user._count.movements).toBe(SEED_MOVEMENTS.length);
  });

  it("is idempotent", async () => {
    await seedDatabase(db, CREDENTIALS);
    await seedDatabase(db, CREDENTIALS);
    expect(await db.user.count()).toBe(1);
    expect(await db.card.count()).toBe(2);
    expect(await db.movement.count()).toBe(SEED_MOVEMENTS.length);
  });

  it("orders the newest movements like the home design and stores accent-free search text", async () => {
    await seedDatabase(db, CREDENTIALS);
    const newest = await db.movement.findMany({
      orderBy: { occurredAt: "desc" },
      take: 4,
      select: { counterparty: true, reference: true },
    });
    expect(newest.map((movement) => movement.counterparty)).toEqual([
      "Adobe",
      "Ronaldo",
      "Figma",
      "Juan Perez",
    ]);
    expect(newest[0]?.reference).toBe("GB-000001");
    const jose = await db.movement.findFirstOrThrow({ where: { counterparty: "José Suárez" } });
    expect(jose.counterpartySearch).toBe("jose suarez");
  });

  it("links automatic debits to a card and leaves transfers without one", async () => {
    await seedDatabase(db, CREDENTIALS);
    expect(await db.movement.count({ where: { type: "AUTO_DEBIT", cardId: null } })).toBe(0);
    expect(
      await db.movement.count({
        where: { type: { in: ["RECEIVED", "SENT"] }, cardId: { not: null } },
      }),
    ).toBe(0);
  });
});
