import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { createMovement, createUser } from "./helpers/factories";
import { resetDatabase } from "./helpers/reset-database";

describe("database constraints", () => {
  beforeEach(resetDatabase);

  it("stores a movement with a positive amount", async () => {
    const user = await createUser();
    const movement = await createMovement(user.id, { amountCents: 12500 });
    expect(movement.amountCents).toBe(12500);
  });

  it("rejects non-positive amounts", async () => {
    const user = await createUser();
    await expect(createMovement(user.id, { amountCents: 0 })).rejects.toThrow(
      /movements_amount_cents_positive/,
    );
  });

  it("rejects card numbers that are not four digits", async () => {
    const user = await createUser();
    await expect(
      db.card.create({
        data: {
          userId: user.id,
          brand: "VISA",
          last4: "12a4",
          holderName: "Test",
          expMonth: 1,
          expYear: 2030,
          balanceCents: 0,
        },
      }),
    ).rejects.toThrow(/cards_last4_digits/);
  });
});
