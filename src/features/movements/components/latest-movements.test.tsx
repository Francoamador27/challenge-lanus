import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildMovement } from "../../../../tests/fixtures/movements";
import { LatestMovements } from "./latest-movements";

describe("LatestMovements", () => {
  it("lists the movements under the section title", () => {
    render(
      <LatestMovements
        movements={[buildMovement(), buildMovement({ counterparty: "Ronaldo", type: "received" })]}
      />,
    );
    const section = screen.getByRole("region", { name: "Últimos movimientos" });
    expect(section).toHaveTextContent("Adobe");
    expect(section).toHaveTextContent("Ronaldo");
  });

  it("explains when there are no movements yet", () => {
    render(<LatestMovements movements={[]} />);
    expect(screen.getByText("Todavía no tenés movimientos")).toBeVisible();
  });
});
