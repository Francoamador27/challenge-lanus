import { ApiError } from "@/lib/api-error";
import type { MovementPage, MovementType } from "@/shared/movements";

export type MovementsQuery = { q?: string; type?: MovementType };

type FetchPageParams = MovementsQuery & {
  cursor?: string | null;
  limit?: number;
  signal?: AbortSignal;
};

/** Fetches one page of the signed-in user's movements from the REST API. */
export async function fetchMovementsPage({
  q,
  type,
  cursor,
  limit,
  signal,
}: FetchPageParams): Promise<MovementPage> {
  const url = new URL("/api/v1/movements", window.location.origin);
  if (q) url.searchParams.set("q", q);
  if (type) url.searchParams.set("type", type);
  if (cursor) url.searchParams.set("cursor", cursor);
  if (limit) url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    signal,
    credentials: "same-origin",
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as { title?: string } | null;
    throw new ApiError(response.status, problem?.title ?? response.statusText);
  }
  return (await response.json()) as MovementPage;
}
