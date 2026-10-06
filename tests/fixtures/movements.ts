import type { MovementDTO } from "@/shared/movements";

/** Builds a movement DTO for component tests. */
export function buildMovement(overrides: Partial<MovementDTO> = {}): MovementDTO {
  return {
    id: crypto.randomUUID(),
    type: "auto_debit",
    counterparty: "Adobe",
    amount: { cents: 12_500, currency: "USD" },
    occurredAt: "2026-10-06T15:32:00.000Z",
    reference: "GB-000001",
    card: { brand: "mastercard", last4: "1234" },
    ...overrides,
  };
}
