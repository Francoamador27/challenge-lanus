import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatCardExpiry,
  formatDate,
  formatMoney,
  formatTime,
  maskCardNumber,
} from "./format";

describe("formatMoney", () => {
  it("omits decimals for whole amounts, like the design", () => {
    expect(formatMoney(12500, "USD")).toBe("$125");
    expect(formatMoney(100000, "USD")).toBe("$1,000");
  });

  it("shows cents when the amount has them", () => {
    expect(formatMoney(1299, "USD")).toBe("$12.99");
    expect(formatMoney(123456, "USD")).toBe("$1,234.56");
  });
});

describe("formatAmount", () => {
  it("always shows two decimals", () => {
    expect(formatAmount(97885)).toBe("978.85");
    expect(formatAmount(5000)).toBe("50.00");
  });
});

describe("formatDate and formatTime", () => {
  it("formats in Buenos Aires time", () => {
    expect(formatDate("2026-10-06T15:32:00.000Z")).toBe("6 de octubre de 2026");
    expect(formatTime("2026-10-06T15:32:00.000Z")).toBe("12:32 h");
  });

  it("uses the Buenos Aires calendar day near midnight UTC", () => {
    expect(formatDate("2026-10-06T01:00:00.000Z")).toBe("5 de octubre de 2026");
    expect(formatTime("2026-10-06T01:00:00.000Z")).toBe("22:00 h");
  });
});

describe("card helpers", () => {
  it("formats the expiry as MM/YY", () => {
    expect(formatCardExpiry(2, 2030)).toBe("02/30");
    expect(formatCardExpiry(11, 2028)).toBe("11/28");
  });

  it("masks all but the last four digits", () => {
    expect(maskCardNumber("1234")).toBe("**** **** **** 1234");
  });
});
