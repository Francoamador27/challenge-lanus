import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildMovement } from "../../../../tests/fixtures/movements";
import { MovementItem } from "./movement-item";

describe("MovementItem", () => {
  it("links to the movement detail", () => {
    const movement = buildMovement();
    render(<MovementItem movement={movement} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/movimientos/${movement.id}`);
  });

  it.each([
    ["auto_debit", "Pago de suscripción", "Egreso de $125"],
    ["received", "Pago recibido", "Ingreso de $125"],
    ["sent", "Pago enviado", "Egreso de $125"],
  ] as const)("describes a %s movement with text, not just color", (type, subtitle, amount) => {
    render(<MovementItem movement={buildMovement({ type })} />);
    expect(screen.getByText(subtitle)).toBeVisible();
    expect(screen.getByRole("link")).toHaveTextContent(amount);
  });
});
