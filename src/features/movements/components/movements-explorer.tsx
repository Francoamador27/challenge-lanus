"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Inbox, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ApiError } from "@/lib/api-error";
import { cn } from "@/lib/cn";
import type { MovementPage, MovementType } from "@/shared/movements";
import type { MovementsQuery } from "../api";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useMovementsQuery } from "../hooks/use-movements-query";
import { InfiniteScrollSentinel } from "./infinite-scroll-sentinel";
import { MovementList } from "./movement-list";
import { MovementListSkeleton } from "./movement-list-skeleton";
import { SearchField } from "./search-field";
import { TypeFilterChips } from "./type-filter-chips";

export type MovementsExplorerProps = {
  userId: string;
  initialFilters: MovementsQuery;
  initialPage: MovementPage;
  autoFocusSearch?: boolean;
};

/** Interactive movements list: debounced search, quick filters, infinite scroll and every loading, error and empty state. */
export function MovementsExplorer({
  userId,
  initialFilters,
  initialPage,
  autoFocusSearch = false,
}: MovementsExplorerProps) {
  const [query, setQuery] = useState(initialFilters.q ?? "");
  const [type, setType] = useState<MovementType | undefined>(initialFilters.type);
  const q = useDebouncedValue(query.trim()) || undefined;
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
  } = useMovementsQuery(
    { q, type },
    { userId, initial: { filters: initialFilters, page: initialPage } },
  );

  // Mirror the filters in the URL without a server round trip, so the view can be shared and restored.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [q, type]);

  useEffect(() => {
    if (autoFocusSearch) {
      searchRef.current?.focus();
    }
  }, [autoFocusSearch]);

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

  const clearFilters = () => {
    setQuery("");
    setType(undefined);
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
      q || type ? (
        <EmptyState
          icon={<SearchX className="size-6" />}
          title={q ? `No encontramos movimientos para “${q}”` : "No hay movimientos de este tipo"}
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
        <MovementList movements={movements} />
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
      <TypeFilterChips value={type} onChange={setType} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      {content}
    </div>
  );
}
