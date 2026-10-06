import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LogoutButton } from "./logout-button";

vi.mock("@/features/auth/actions", () => ({ logout: vi.fn() }));

describe("LogoutButton", () => {
  it("forgets every cached query before signing out", async () => {
    const client = new QueryClient();
    client.setQueryData(["movements", "user-a", { q: "", type: "all" }], {
      pages: [],
      pageParams: [],
    });
    render(
      <QueryClientProvider client={client}>
        <LogoutButton />
      </QueryClientProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(client.getQueryCache().getAll()).toHaveLength(0);
  });
});
