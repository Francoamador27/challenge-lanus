import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CardBrand as DbCardBrand,
  MovementType as DbMovementType,
} from "@/generated/prisma/enums";
import type { CardBrand } from "@/shared/cards";
import type { MovementDTO, MovementType } from "@/shared/movements";

/** Columns every movement query selects. */
export const MOVEMENT_SELECT = {
  id: true,
  type: true,
  counterparty: true,
  amountCents: true,
  currency: true,
  reference: true,
  occurredAt: true,
  card: { select: { brand: true, last4: true } },
} satisfies Prisma.MovementSelect;

export type MovementRow = Prisma.MovementGetPayload<{ select: typeof MOVEMENT_SELECT }>;

const TYPE_TO_CONTRACT: Record<DbMovementType, MovementType> = {
  AUTO_DEBIT: "auto_debit",
  RECEIVED: "received",
  SENT: "sent",
};

const TYPE_FROM_CONTRACT: Record<MovementType, DbMovementType> = {
  auto_debit: "AUTO_DEBIT",
  received: "RECEIVED",
  sent: "SENT",
};

const BRAND_TO_CONTRACT: Record<DbCardBrand, CardBrand> = {
  MASTERCARD: "mastercard",
  VISA: "visa",
};

/** Maps a database card brand to the public contract value. */
export function toCardBrand(brand: DbCardBrand): CardBrand {
  return BRAND_TO_CONTRACT[brand];
}

/** Maps a contract movement type to the database enum. */
export function toDbMovementType(type: MovementType): DbMovementType {
  return TYPE_FROM_CONTRACT[type];
}

/** Converts a selected movement row into the public DTO. */
export function toMovementDTO(row: MovementRow): MovementDTO {
  return {
    id: row.id,
    type: TYPE_TO_CONTRACT[row.type],
    counterparty: row.counterparty,
    amount: { cents: row.amountCents, currency: row.currency },
    occurredAt: row.occurredAt.toISOString(),
    reference: row.reference,
    card: row.card ? { brand: toCardBrand(row.card.brand), last4: row.card.last4 } : null,
  };
}
