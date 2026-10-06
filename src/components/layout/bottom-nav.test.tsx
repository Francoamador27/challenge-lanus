import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as baseRender, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { BottomNav } from "./bottom-nav";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));
vi.mock("@/features/auth/actions", () => ({ logout: vi.fn() }));

const render = (ui: ReactElement) =>
  baseRender(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

describe("BottomNav", () => {
  it("marks the home link as current on /", () => {
    pathname.current = "/";
    render(<BottomNav />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Movimientos" })).not.toHaveAttribute("aria-current");
  });

  it("keeps Movimientos current on a movement detail", () => {
    pathname.current = "/movimientos/0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e";
    render(<BottomNav />);
    expect(screen.getByRole("link", { name: "Movimientos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("offers a logout control", () => {
    render(<BottomNav />);
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeInTheDocument();
  });
});
