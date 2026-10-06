import type { Metadata } from "next";
import { MovementsExplorer } from "@/features/movements/components/movements-explorer";
import { firstParam } from "@/lib/search-params";
import { requireUser } from "@/server/auth/current-user";
import { listMovements } from "@/server/movements/movements-service";
import { DEFAULT_PAGE_SIZE, listMovementsQuerySchema } from "@/shared/movements";

export const metadata: Metadata = { title: "Movimientos" };

/** Movements screen: server-renders the first page, then hands control to the interactive explorer. */
export default async function MovementsPage({ searchParams }: PageProps<"/movimientos">) {
  const user = await requireUser();
  const params = await searchParams;
  const parsed = listMovementsQuerySchema.safeParse({
    q: firstParam(params.q),
    type: firstParam(params.type),
  });
  const filters = parsed.success ? { q: parsed.data.q, type: parsed.data.type } : {};
  const firstPage = await listMovements(user.id, { ...filters, limit: DEFAULT_PAGE_SIZE });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Movimientos</h1>
      <MovementsExplorer
        userId={user.id}
        initialFilters={filters}
        initialPage={firstPage}
        autoFocusSearch={firstParam(params.focus) === "search"}
      />
    </div>
  );
}
