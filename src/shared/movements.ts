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

/** Search and type filters of the movements screen, as they appear in its URL. */
export type MovementsFilters = { q?: string; type?: MovementType };

/** Reads the movements filters from URL params, validating each field on its own. */
export function parseMovementsFilters(
  get: (name: "q" | "type") => string | null | undefined,
): MovementsFilters {
  const q = listMovementsQuerySchema.shape.q.safeParse(get("q") ?? undefined);
  const type = listMovementsQuerySchema.shape.type.safeParse(get("type") ?? undefined);
  return { q: q.success ? q.data : undefined, type: type.success ? type.data : undefined };
}

/** Serializes the filters that are set as a URL query string, without the leading `?`. */
export function toMovementsSearch({ q, type }: MovementsFilters): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  return params.toString();
}

/** URL of the movements screen showing the given filters. */
export function buildMovementsHref(filters: MovementsFilters): string {
  const search = toMovementsSearch(filters);
  return search ? `/movimientos?${search}` : "/movimientos";
}
