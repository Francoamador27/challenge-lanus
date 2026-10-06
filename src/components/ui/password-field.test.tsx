import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "./password-field";

describe("PasswordField", () => {
  it("toggles the password visibility", async () => {
    render(<PasswordField label="Contraseña" />);
    const input = screen.getByLabelText("Contraseña", { selector: "input" });
    const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
