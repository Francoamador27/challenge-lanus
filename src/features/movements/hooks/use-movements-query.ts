import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { MovementPage, MovementsFilters } from "@/shared/movements";
import { fetchMovementsPage } from "../api";

const STALE_TIME_MS = 30_000;

type MovementsQueryOptions = {
  userId: string;
  initial?: { filters: MovementsFilters; page: MovementPage };
};

/**
 * Infinite query over the movements API, cached per user so one account never sees another's data.
 * Reuses the server-rendered first page when the filters match.
 */
export function useMovementsQuery(
  filters: MovementsFilters,
  { userId, initial }: MovementsQueryOptions,
) {
  const matchesInitial =
    initial !== undefined &&
    initial.filters.q === filters.q &&
    initial.filters.type === filters.type;
  return useInfiniteQuery({
    queryKey: ["movements", userId, { q: filters.q ?? "", type: filters.type ?? "all" }],
    queryFn: ({ pageParam, signal }) =>
      fetchMovementsPage({ ...filters, cursor: pageParam, signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME_MS,
    initialData: matchesInitial ? { pages: [initial.page], pageParams: [null] } : undefined,
  });
}
