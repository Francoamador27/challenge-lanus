import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "./chip";

describe("Chip", () => {
  it("exposes its state with aria-pressed", () => {
    render(
      <>
        <Chip pressed>Todos</Chip>
        <Chip pressed={false}>Recibido</Chip>
      </>,
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Recibido" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
