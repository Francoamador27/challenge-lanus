import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { MovementPage } from "@/shared/movements";
import { buildMovement } from "../../../../tests/fixtures/movements";
import { server } from "../../../../tests/msw/server";
import { MovementsExplorer } from "./movements-explorer";

const router = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

const API = "http://localhost:3000/api/v1/movements";
const adobe = buildMovement({ counterparty: "Adobe" });
const ronaldo = buildMovement({ counterparty: "Ronaldo", type: "received" });
const FIRST_PAGE: MovementPage = { data: [adobe, ronaldo], nextCursor: null };

let requests: URL[] = [];

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  requests = [];
  window.history.replaceState(null, "", "/movimientos");
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function respondWith(
  resolver: (url: URL) => MovementPage | Response | Promise<MovementPage | Response>,
) {
  server.use(
    http.get(API, async ({ request }) => {
      const url = new URL(request.url);
      requests.push(url);
      const result = await resolver(url);
      return result instanceof Response ? result : HttpResponse.json(result);
    }),
  );
}

function renderExplorer(
  page: MovementPage = FIRST_PAGE,
  props: { autoFocusSearch?: boolean; userId?: string } = {},
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { userId = "user-a", ...rest } = props;
  const view = render(
    <MovementsExplorer userId={userId} initialFilters={{}} initialPage={page} {...rest} />,
    { wrapper },
  );
  return { ...view, client };
}

const rows = () =>
  screen.queryAllByRole("listitem").map((item) => within(item).getByRole("link").textContent);

describe("MovementsExplorer", () => {
  it("renders the server-provided first page without calling the API", async () => {
    respondWith(() => FIRST_PAGE);
    renderExplorer();
    expect(rows()).toHaveLength(2);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(requests).toHaveLength(0);
  });

  it("searches after the user stops typing and keeps the URL in sync", async () => {
    respondWith((url) => ({
      data: url.searchParams.get("q") === "adobe" ? [adobe] : [],
      nextCursor: null,
    }));
    renderExplorer();
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar movimientos" }), "adobe");
    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(requests.map((url) => url.searchParams.get("q"))).toEqual(["adobe"]);
    expect(window.location.search).toBe("?q=adobe");
  });

  it("filters by type with the quick filter chips", async () => {
    respondWith((url) => ({
      data: url.searchParams.get("type") === "received" ? [ronaldo] : [],
      nextCursor: null,
    }));
    renderExplorer();
    await userEvent.click(screen.getByRole("button", { name: "Recibido" }));
    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(screen.getByRole("button", { name: "Recibido" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
    expect(window.location.search).toBe("?type=received");
  });

  it("explains empty results and clears every filter", async () => {
    respondWith((url) =>
      url.searchParams.size === 0 ? FIRST_PAGE : { data: [], nextCursor: null },
    );
    renderExplorer();
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar movimientos" }), "zzz");
    expect(await screen.findByText("No encontramos movimientos para “zzz”")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(screen.getByRole("searchbox", { name: "Buscar movimientos" })).toHaveValue("");
  });

  it("shows a friendly message when the user has no movements at all", () => {
    renderExplorer({ data: [], nextCursor: null });
    expect(screen.getByText("Todavía no tenés movimientos")).toBeVisible();
  });

  it("shows an error with a working retry", async () => {
    let fail = true;
    respondWith(() =>
      fail
        ? HttpResponse.json({ title: "Internal Server Error", status: 500 }, { status: 500 })
        : { data: [adobe], nextCursor: null },
    );
    renderExplorer();
    await userEvent.click(screen.getByRole("button", { name: "Enviado" }));
    expect(await screen.findByText("No pudimos cargar tus movimientos")).toBeVisible();
    fail = false;
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(rows()).toHaveLength(1));
  });

  it("loads the next page with the cursor and appends it", async () => {
    respondWith((url) => {
      expect(url.searchParams.get("cursor")).toBe("next-page");
      return { data: [buildMovement({ counterparty: "Figma" })], nextCursor: null };
    });
    renderExplorer({ data: [adobe], nextCursor: "next-page" });
    await userEvent.click(screen.getByRole("button", { name: "Ver más movimientos" }));
    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(screen.queryByRole("button", { name: "Ver más movimientos" })).not.toBeInTheDocument();
  });

  it("never lets a slow, older response replace newer results", async () => {
    respondWith(async (url) => {
      if (url.searchParams.get("q") === "ad") {
        await delay(600);
        return { data: [buildMovement({ counterparty: "Stale result" })], nextCursor: null };
      }
      return { data: [adobe], nextCursor: null };
    });
    renderExplorer();
    const search = screen.getByRole("searchbox", { name: "Buscar movimientos" });
    await userEvent.type(search, "ad");
    await new Promise((resolve) => setTimeout(resolve, 350));
    await userEvent.type(search, "obe");
    await waitFor(() => expect(rows()).toEqual([expect.stringContaining("Adobe")]));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(screen.queryByText("Stale result")).not.toBeInTheDocument();
  });

  it("sends the user to login when the session expired and forgets cached data", async () => {
    respondWith(() => HttpResponse.json({ title: "Unauthorized", status: 401 }, { status: 401 }));
    const { client } = renderExplorer();
    await userEvent.click(screen.getByRole("button", { name: "Enviado" }));
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/login?next=/movimientos"));
    expect(client.getQueryCache().getAll()).toHaveLength(0);
  });

  it("never shows a previous user's cached movements", () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    renderExplorer(FIRST_PAGE, { userId: "user-a" }, client).unmount();
    renderExplorer(
      { data: [buildMovement({ counterparty: "Solo de B" })], nextCursor: null },
      { userId: "user-b" },
      client,
    );
    expect(rows()).toEqual([expect.stringContaining("Solo de B")]);
  });

  it("focuses the search when opened from the home magnifier", () => {
    renderExplorer(FIRST_PAGE, { autoFocusSearch: true });
    expect(screen.getByRole("searchbox", { name: "Buscar movimientos" })).toHaveFocus();
  });
});
