import { z } from "zod";
import type { CardBrand } from "@/shared/cards";
import type { Money } from "@/shared/money";

export const MOVEMENT_TYPES = ["auto_debit", "received", "sent"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export type MovementDTO = {
  id: string;
  type: MovementType;
  counterparty: string;
  amount: Money;
  occurredAt: string;
  reference: string;
  card: { brand: CardBrand; last4: string } | null;
};

export type MovementPage = { data: MovementDTO[]; nextCursor: string | null };

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;
export const SEARCH_MAX_LENGTH = 50;

/** Query parameters accepted by the movements list endpoint. */
export const listMovementsQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .max(SEARCH_MAX_LENGTH)
    .optional()
    .transform((value) => value || undefined),
  type: z.enum(MOVEMENT_TYPES).optional(),
  cursor: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type ListMovementsQuery = z.infer<typeof listMovementsQuerySchema>;
