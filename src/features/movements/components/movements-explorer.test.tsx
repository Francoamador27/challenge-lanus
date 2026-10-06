import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { MovementPage } from "@/shared/movements";
import { buildMovement } from "../../../../tests/fixtures/movements";
import { server } from "../../../../tests/msw/server";
import { MovementsExplorer } from "./movements-explorer";

const navigation = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  return {
    router: { replace: vi.fn() },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    notify() {
      listeners.forEach((listener) => listener());
    },
  };
});

// Next keeps useSearchParams in sync with the URL, including native history updates; mirror that.
vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    useRouter: () => navigation.router,
    useSearchParams: () =>
      new URLSearchParams(useSyncExternalStore(navigation.subscribe, () => window.location.search)),
  };
});

const API = "http://localhost:3000/api/v1/movements";
const adobe = buildMovement({ counterparty: "Adobe" });
const ronaldo = buildMovement({ counterparty: "Ronaldo", type: "received" });
const juan = buildMovement({ counterparty: "Juan Cabrero", type: "received" });
const FIRST_PAGE: MovementPage = { data: [adobe, ronaldo], nextCursor: null };
const HISTORY_METHODS = ["pushState", "replaceState"] as const;
const originalHistory = {
  pushState: window.history.pushState,
  replaceState: window.history.replaceState,
};

let requests: URL[] = [];

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  for (const method of HISTORY_METHODS) {
    window.history[method] = (...args: Parameters<History["pushState"]>) => {
      originalHistory[method].apply(window.history, args);
      navigation.notify();
    };
  }
});
beforeEach(() => {
  requests = [];
  window.history.replaceState(null, "", "/movimientos");
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  for (const method of HISTORY_METHODS) {
    window.history[method] = originalHistory[method];
  }
});

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
  { userId = "user-a" }: { userId?: string } = {},
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const view = render(
    <MovementsExplorer userId={userId} initialFilters={{}} initialPage={page} />,
    { wrapper },
  );
  return { ...view, client };
}

const rows = () =>
  screen.queryAllByRole("listitem").map((item) => within(item).getByRole("link").textContent);
const searchbox = () => screen.getByRole("searchbox", { name: "Buscar movimientos" });

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
    await userEvent.type(searchbox(), "adobe");
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

  it("explains empty results and clears every filter right away", async () => {
    respondWith((url) =>
      url.searchParams.size === 0 ? FIRST_PAGE : { data: [], nextCursor: null },
    );
    renderExplorer();
    await userEvent.type(searchbox(), "zzz");
    expect(await screen.findByText("No encontramos movimientos para “zzz”")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(window.location.search).toBe("");
    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(searchbox()).toHaveValue("");
  });

  it("keeps a canonical URL whatever the order of the user's actions", async () => {
    respondWith(() => ({ data: [juan], nextCursor: null }));
    renderExplorer();
    await userEvent.type(searchbox(), "juan");
    await userEvent.click(screen.getByRole("button", { name: "Recibido" }));
    await waitFor(() => expect(window.location.search).toBe("?q=juan&type=received"));
  });

  it("seeds the search and filter from the URL rather than the server props", async () => {
    window.history.replaceState(null, "", "/movimientos?q=juan&type=received");
    respondWith((url) =>
      url.searchParams.get("q") === "juan" && url.searchParams.get("type") === "received"
        ? { data: [juan], nextCursor: null }
        : FIRST_PAGE,
    );
    renderExplorer();
    expect(searchbox()).toHaveValue("juan");
    expect(screen.getByRole("button", { name: "Recibido" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => expect(rows()).toEqual([expect.stringContaining("Juan Cabrero")]));
  });

  it("adopts URL changes it did not make, such as back navigation or the bottom nav", async () => {
    window.history.replaceState(null, "", "/movimientos?q=juan");
    respondWith((url) =>
      url.searchParams.get("q") === "juan" ? { data: [juan], nextCursor: null } : FIRST_PAGE,
    );
    renderExplorer();
    await waitFor(() => expect(rows()).toEqual([expect.stringContaining("Juan Cabrero")]));
    act(() => window.history.pushState(null, "", "/movimientos"));
    expect(searchbox()).toHaveValue("");
    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(window.location.search).toBe("");
  });

  it("links each row to its detail carrying the current filters", async () => {
    window.history.replaceState(null, "", "/movimientos?q=adobe");
    respondWith(() => ({ data: [adobe], nextCursor: null }));
    renderExplorer();
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Adobe/ })).toHaveAttribute(
        "href",
        `/movimientos/${adobe.id}?from=q%3Dadobe`,
      ),
    );
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
    await userEvent.type(searchbox(), "ad");
    await new Promise((resolve) => setTimeout(resolve, 350));
    await userEvent.type(searchbox(), "obe");
    await waitFor(() => expect(rows()).toEqual([expect.stringContaining("Adobe")]));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(screen.queryByText("Stale result")).not.toBeInTheDocument();
  });

  it("sends the user to login when the session expired and forgets cached data", async () => {
    respondWith(() => HttpResponse.json({ title: "Unauthorized", status: 401 }, { status: 401 }));
    const { client } = renderExplorer();
    await userEvent.click(screen.getByRole("button", { name: "Enviado" }));
    await waitFor(() =>
      expect(navigation.router.replace).toHaveBeenCalledWith("/login?next=/movimientos"),
    );
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

  it("focuses the search when opened from the home magnifier and tidies the URL", () => {
    window.history.replaceState(null, "", "/movimientos?focus=search");
    renderExplorer();
    expect(searchbox()).toHaveFocus();
    expect(window.location.search).toBe("");
  });
});
