import "server-only";
import { db } from "@/server/db";
import { toCardBrand } from "@/server/movements/movement-mapper";
import type { CardDTO } from "@/shared/cards";

/** Lists the user's cards in the order the home carousel shows them. */
export async function listCards(userId: string): Promise<CardDTO[]> {
  const cards = await db.card.findMany({
    where: { userId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      brand: true,
      last4: true,
      holderName: true,
      expMonth: true,
      expYear: true,
      balanceCents: true,
      currency: true,
    },
  });
  return cards.map((card) => ({
    id: card.id,
    brand: toCardBrand(card.brand),
    last4: card.last4,
    holderName: card.holderName,
    expMonth: card.expMonth,
    expYear: card.expYear,
    balance: { cents: card.balanceCents, currency: card.currency },
  }));
}
