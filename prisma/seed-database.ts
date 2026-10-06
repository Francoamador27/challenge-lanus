import type { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/server/auth/password";
import { normalizeSearchText } from "../src/shared/search";
import { SEED_CARDS, SEED_MOVEMENTS } from "./seed-data";

export type SeedOptions = { email: string; password: string; now?: Date };

/** Creates or refreshes the demo user with deterministic cards and movements. */
export async function seedDatabase(
  db: PrismaClient,
  { email, password, now = new Date() }: SeedOptions,
): Promise<{ userId: string; movements: number }> {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  return db.$transaction(
    async (tx) => {
      const user = await tx.user.upsert({
        where: { email: normalizedEmail },
        update: { passwordHash, displayName: "Granate" },
        create: { email: normalizedEmail, passwordHash, displayName: "Granate" },
      });

      await tx.movement.deleteMany({ where: { userId: user.id } });
      await tx.card.deleteMany({ where: { userId: user.id } });

      const cardIds = new Map<string, string>();
      for (const [index, card] of SEED_CARDS.entries()) {
        const created = await tx.card.create({
          data: {
            userId: user.id,
            brand: card.brand,
            last4: card.last4,
            holderName: card.holderName,
            expMonth: card.expMonth,
            expYear: card.expYear,
            balanceCents: card.balanceCents,
            // Spaced one second apart so the carousel order is stable.
            createdAt: new Date(now.getTime() - (SEED_CARDS.length - index) * 1_000),
          },
        });
        cardIds.set(card.key, created.id);
      }

      await tx.movement.createMany({
        data: SEED_MOVEMENTS.map((movement, index) => ({
          userId: user.id,
          cardId: movement.card ? (cardIds.get(movement.card) ?? null) : null,
          type: movement.type,
          counterparty: movement.counterparty,
          counterpartySearch: normalizeSearchText(movement.counterparty),
          amountCents: movement.amountCents,
          reference: `GB-${String(index + 1).padStart(6, "0")}`,
          occurredAt: new Date(now.getTime() - movement.minutesAgo * 60_000),
        })),
      });

      return { userId: user.id, movements: SEED_MOVEMENTS.length };
    },
    // A remote database waking from scale-to-zero can take seconds to start a transaction.
    { maxWait: 15_000, timeout: 30_000 },
  );
}
