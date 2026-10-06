import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { LoginState } from "@/shared/auth";
import { LoginForm, type LoginFormProps } from "./login-form";

describe("LoginForm", () => {
  it("shows field errors returned by the action", async () => {
    const action = vi.fn(async (): Promise<LoginState> => ({
      status: "error",
      email: "",
      remember: false,
      fieldErrors: { email: "Ingresá tu email", password: "Ingresá tu contraseña" },
    }));
    render(<LoginForm action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByText("Ingresá tu email")).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Contraseña", { selector: "input" })).toHaveAccessibleDescription(
      "Ingresá tu contraseña",
    );
  });

  it("announces wrong credentials and keeps the typed email", async () => {
    const action = vi.fn(async (_state: LoginState, formData: FormData): Promise<LoginState> => ({
      status: "error",
      email: String(formData.get("email")),
      remember: false,
      formError: "Email o contraseña incorrectos",
    }));
    render(<LoginForm action={action} />);
    await userEvent.type(screen.getByLabelText("Email"), "soygranate@clublanus.com");
    await userEvent.type(screen.getByLabelText("Contraseña", { selector: "input" }), "mala");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email o contraseña incorrectos");
    expect(screen.getByLabelText("Email")).toHaveValue("soygranate@clublanus.com");
  });

  it("disables the button while signing in", async () => {
    let finish: (state: LoginState) => void = () => {};
    const action = vi.fn(() => new Promise<LoginState>((resolve) => (finish = resolve)));
    render(<LoginForm action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByRole("button", { name: "Ingresando…" })).toBeDisabled();
    finish({ status: "idle", email: "", remember: false });
    expect(await screen.findByRole("button", { name: "Ingresar" })).toBeEnabled();
  });

  it("sends the redirect target with the credentials", async () => {
    const action = vi.fn<LoginFormProps["action"]>(async () => ({
      status: "idle",
      email: "",
      remember: false,
    }));
    render(<LoginForm action={action} next="/movimientos" />);
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    const formData = action.mock.calls[0]?.[1] as FormData | undefined;
    expect(formData?.get("next")).toBe("/movimientos");
  });
});
