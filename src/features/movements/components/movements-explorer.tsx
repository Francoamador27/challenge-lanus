"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Inbox, SearchX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ApiError } from "@/lib/api-error";
import { cn } from "@/lib/cn";
import {
  parseMovementsFilters,
  toMovementsSearch,
  type MovementPage,
  type MovementsFilters,
  type MovementType,
} from "@/shared/movements";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useMovementsQuery } from "../hooks/use-movements-query";
import { InfiniteScrollSentinel } from "./infinite-scroll-sentinel";
import { MovementList } from "./movement-list";
import { MovementListSkeleton } from "./movement-list-skeleton";
import { SearchField } from "./search-field";
import { TypeFilterChips } from "./type-filter-chips";

export type MovementsExplorerProps = {
  userId: string;
  initialFilters: MovementsFilters;
  initialPage: MovementPage;
};

/** Filters currently in the address bar, read at call time from inside event handlers and effects. */
function currentUrlFilters(): MovementsFilters {
  const params = new URLSearchParams(window.location.search);
  return parseMovementsFilters((name) => params.get(name));
}

/**
 * Writes the filters to the current history entry in canonical order, without a server round trip.
 * Next keeps `useSearchParams` in sync with native history updates.
 */
function replaceFilters(filters: MovementsFilters): void {
  const search = toMovementsSearch(filters);
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
}

/**
 * Interactive movements list: debounced search, quick filters, infinite scroll and every loading,
 * error and empty state. The URL is the source of truth for the search and filter, so back/forward
 * navigation, links and shared URLs all restore them.
 */
export function MovementsExplorer({ userId, initialFilters, initialPage }: MovementsExplorerProps) {
  const searchParams = useSearchParams();
  const filters = parseMovementsFilters((name) => searchParams.get(name));
  const urlQuery = filters.q ?? "";

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(query.trim());
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  if (urlQuery !== syncedUrlQuery) {
    // The URL changed under us (back/forward, a link): show its search unless it is our own write.
    setSyncedUrlQuery(urlQuery);
    if (urlQuery !== debouncedQuery) {
      setQuery(urlQuery);
    }
  }

  const [focusOnMount] = useState(() => searchParams.get("focus") === "search");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMovementsQuery(filters, {
    userId,
    initial: { filters: initialFilters, page: initialPage },
  });

  // Commit the debounced search to the URL, which drives the query.
  useEffect(() => {
    const current = currentUrlFilters();
    if ((current.q ?? "") === debouncedQuery) {
      return;
    }
    replaceFilters({ ...current, q: debouncedQuery || undefined });
  }, [debouncedQuery]);

  useEffect(() => {
    if (!focusOnMount) {
      return;
    }
    searchRef.current?.focus();
    // Drop the one-shot `focus` param so back navigation does not refocus the search.
    replaceFilters(currentUrlFilters());
  }, [focusOnMount]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      // The session is gone: drop its cached data before anyone else signs in on this tab.
      queryClient.clear();
      router.replace("/login?next=/movimientos");
    }
  }, [error, queryClient, router]);

  const loadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const selectType = (type: MovementType | undefined) => {
    replaceFilters({ ...currentUrlFilters(), type });
  };

  const clearFilters = () => {
    setQuery("");
    replaceFilters({});
  };

  const movements = data?.pages.flatMap((page) => page.data) ?? [];
  const settled = !isPending && !isPlaceholderData && !isError;
  const announcement = !settled
    ? ""
    : movements.length === 0
      ? "Sin resultados"
      : `${movements.length} ${movements.length === 1 ? "movimiento" : "movimientos"}`;

  let content: ReactNode;
  if (isPending) {
    content = <MovementListSkeleton rows={6} />;
  } else if (isError && movements.length === 0) {
    content = (
      <ErrorState
        title="No pudimos cargar tus movimientos"
        description="Revisá tu conexión e intentá de nuevo."
        onRetry={() => void refetch()}
      />
    );
  } else if (movements.length === 0) {
    content =
      filters.q || filters.type ? (
        <EmptyState
          icon={<SearchX className="size-6" />}
          title={
            filters.q
              ? `No encontramos movimientos para “${filters.q}”`
              : "No hay movimientos de este tipo"
          }
          description="Probá con otro nombre o filtro."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Todavía no tenés movimientos"
          description="Cuando uses tus tarjetas, vas a verlos acá."
        />
      );
  } else {
    content = (
      <div
        aria-busy={isPlaceholderData || undefined}
        className={cn("flex flex-col gap-3 transition-opacity", isPlaceholderData && "opacity-60")}
      >
        <MovementList movements={movements} linkSearch={toMovementsSearch(filters)} />
        {isFetchingNextPage && <MovementListSkeleton rows={3} />}
        {isFetchNextPageError && (
          <div role="alert" className="flex flex-col items-center gap-1 py-2 text-center">
            <p className="text-sm text-subtle">No pudimos cargar más movimientos.</p>
            <Button variant="ghost" onClick={loadMore}>
              Reintentar
            </Button>
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && !isFetchNextPageError && (
          <>
            <InfiniteScrollSentinel onVisible={loadMore} disabled={isFetchingNextPage} />
            <Button variant="ghost" onClick={loadMore} className="self-center">
              Ver más movimientos
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SearchField
        value={query}
        onChange={setQuery}
        busy={isFetching && !isFetchingNextPage}
        inputRef={searchRef}
      />
      <TypeFilterChips value={filters.type} onChange={selectType} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      {content}
    </div>
  );
}
