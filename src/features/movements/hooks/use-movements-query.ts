import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { MovementPage } from "@/shared/movements";
import { fetchMovementsPage, type MovementsQuery } from "../api";

const STALE_TIME_MS = 30_000;

/** Infinite query over the movements API; reuses the server-rendered first page when the filters match. */
export function useMovementsQuery(
  filters: MovementsQuery,
  initial?: { filters: MovementsQuery; page: MovementPage },
) {
  const matchesInitial =
    initial !== undefined &&
    initial.filters.q === filters.q &&
    initial.filters.type === filters.type;
  return useInfiniteQuery({
    queryKey: ["movements", { q: filters.q ?? "", type: filters.type ?? "all" }],
    queryFn: ({ pageParam, signal }) =>
      fetchMovementsPage({ ...filters, cursor: pageParam, signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME_MS,
    initialData: matchesInitial ? { pages: [initial.page], pageParams: [null] } : undefined,
  });
}
