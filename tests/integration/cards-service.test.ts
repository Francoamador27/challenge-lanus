import { beforeAll, describe, expect, it } from "vitest";
import { listCards } from "@/server/cards/cards-service";
import { db } from "@/server/db";
import { seedDatabase } from "../../prisma/seed-database";
import { createUser } from "./helpers/factories";
import { resetDatabase } from "./helpers/reset-database";

describe("listCards", () => {
  let userId: string;

  beforeAll(async () => {
    await resetDatabase();
    ({ userId } = await seedDatabase(db, {
      email: "soygranate@clublanus.com",
      password: "GRANATE1@",
    }));
  });

  it("returns the user's cards in carousel order as DTOs", async () => {
    const cards = await listCards(userId);
    expect(cards.map(({ id: _id, ...card }) => card)).toEqual([
      {
        brand: "mastercard",
        last4: "1234",
        holderName: "Soy Granate",
        expMonth: 2,
        expYear: 2030,
        balance: { cents: 97_885, currency: "USD" },
      },
      {
        brand: "visa",
        last4: "5678",
        holderName: "Soy Granate",
        expMonth: 11,
        expYear: 2028,
        balance: { cents: 45_020, currency: "USD" },
      },
    ]);
  });

  it("returns an empty list for users without cards", async () => {
    const user = await createUser();
    expect(await listCards(user.id)).toEqual([]);
  });
});
