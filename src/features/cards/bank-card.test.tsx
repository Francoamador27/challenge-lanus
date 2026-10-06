import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildCard } from "../../../tests/fixtures/cards";
import { BankCard } from "./bank-card";

describe("BankCard", () => {
  it("summarizes the card for screen readers", () => {
    render(<BankCard card={buildCard()} themeIndex={0} />);
    expect(
      screen.getByRole("article", {
        name: "Tarjeta Mastercard terminada en 1234, saldo USD 978.85",
      }),
    ).toBeInTheDocument();
  });

  it("shows balance, masked number, holder and expiry like the design", () => {
    render(<BankCard card={buildCard()} themeIndex={0} />);
    expect(screen.getByText("978.85")).toBeVisible();
    expect(screen.getByText("**** **** **** 1234")).toBeVisible();
    expect(screen.getByText("Soy Granate")).toBeVisible();
    expect(screen.getByText("02/30")).toBeVisible();
    expect(screen.getByText("USD")).toBeVisible();
  });
});
