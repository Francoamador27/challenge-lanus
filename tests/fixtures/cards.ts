import type { CardDTO } from "@/shared/cards";

/** Builds a card DTO for component tests. */
export function buildCard(overrides: Partial<CardDTO> = {}): CardDTO {
  return {
    id: crypto.randomUUID(),
    brand: "mastercard",
    last4: "1234",
    holderName: "Soy Granate",
    expMonth: 2,
    expYear: 2030,
    balance: { cents: 97_885, currency: "USD" },
    ...overrides,
  };
}
