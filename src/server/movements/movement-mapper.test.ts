import { describe, expect, it } from "vitest";
import { toDbMovementType, toMovementDTO } from "./movement-mapper";

describe("toMovementDTO", () => {
  it("maps database rows to the public contract", () => {
    expect(
      toMovementDTO({
        id: "0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e",
        type: "AUTO_DEBIT",
        counterparty: "Adobe",
        amountCents: 12_500,
        currency: "USD",
        reference: "GB-000001",
        occurredAt: new Date("2026-10-06T15:32:00.000Z"),
        card: { brand: "MASTERCARD", last4: "1234" },
      }),
    ).toEqual({
      id: "0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e",
      type: "auto_debit",
      counterparty: "Adobe",
      amount: { cents: 12_500, currency: "USD" },
      occurredAt: "2026-10-06T15:32:00.000Z",
      reference: "GB-000001",
      card: { brand: "mastercard", last4: "1234" },
    });
  });

  it("keeps movements without a card as card: null", () => {
    const dto = toMovementDTO({
      id: "0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e",
      type: "RECEIVED",
      counterparty: "Ronaldo",
      amountCents: 9_500,
      currency: "USD",
      reference: "GB-000002",
      occurredAt: new Date("2026-10-06T12:00:00.000Z"),
      card: null,
    });
    expect(dto.type).toBe("received");
    expect(dto.card).toBeNull();
  });
});

describe("toDbMovementType", () => {
  it("maps contract types to database enums", () => {
    expect(toDbMovementType("auto_debit")).toBe("AUTO_DEBIT");
    expect(toDbMovementType("received")).toBe("RECEIVED");
    expect(toDbMovementType("sent")).toBe("SENT");
  });
});
