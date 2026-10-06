import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildMovement } from "../../../../tests/fixtures/movements";
import { MovementDetail } from "./movement-detail";

function field(label: string) {
  const term = screen.getByText(label, { selector: "dt" });
  return term.nextElementSibling?.textContent;
}

describe("MovementDetail", () => {
  it("shows every field of an automatic debit", () => {
    render(<MovementDetail movement={buildMovement()} />);
    expect(screen.getByRole("heading", { level: 1, name: "Adobe" })).toBeVisible();
    expect(field("Fecha")).toBe("6 de octubre de 2026");
    expect(field("Hora")).toBe("12:32 h");
    expect(field("Tipo")).toBe("Débito automático");
    expect(field("Medio de pago")).toBe("Mastercard •••• 1234");
    expect(field("N° de operación")).toBe("GB-000001");
  });

  it("omits the payment method for transfers and announces income", () => {
    render(
      <MovementDetail
        movement={buildMovement({ type: "received", counterparty: "Ronaldo", card: null })}
      />,
    );
    expect(screen.queryByText("Medio de pago")).not.toBeInTheDocument();
    const hero = screen.getByRole("heading", { level: 1 }).parentElement as HTMLElement;
    expect(within(hero).getByText(/Ingreso de/)).toBeInTheDocument();
  });
});
