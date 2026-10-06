import { randomUUID } from "node:crypto";
import type { MovementType } from "@/generated/prisma/enums";
import { db } from "@/server/db";
import { normalizeSearchText } from "@/shared/search";

/** Inserts a user; the password hash is a placeholder unless one is given. */
export function createUser(
  overrides: { email?: string; passwordHash?: string; displayName?: string } = {},
) {
  return db.user.create({
    data: {
      email: overrides.email ?? `user-${randomUUID()}@test.dev`,
      passwordHash: overrides.passwordHash ?? "not-a-real-hash",
      displayName: overrides.displayName ?? "Tester",
    },
  });
}

/** Inserts a movement for the user with sensible defaults. */
export function createMovement(
  userId: string,
  overrides: {
    counterparty?: string;
    type?: MovementType;
    amountCents?: number;
    occurredAt?: Date;
  } = {},
) {
  const counterparty = overrides.counterparty ?? "Comercio de prueba";
  return db.movement.create({
    data: {
      userId,
      type: overrides.type ?? "SENT",
      counterparty,
      counterpartySearch: normalizeSearchText(counterparty),
      amountCents: overrides.amountCents ?? 1000,
      reference: `T-${randomUUID()}`,
      occurredAt: overrides.occurredAt ?? new Date(),
    },
  });
}
