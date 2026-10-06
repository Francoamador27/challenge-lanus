import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("is disabled and marked busy while loading", () => {
    render(<Button loading>Ingresar</Button>);
    const button = screen.getByRole("button", { name: "Ingresar" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole("button", { name: "Ok" })).toHaveAttribute("type", "button");
  });
});
