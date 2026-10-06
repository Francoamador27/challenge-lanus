import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ScreenHeader } from "@/components/layout/screen-header";
import { MovementDetail } from "@/features/movements/components/movement-detail";
import { firstParam } from "@/lib/search-params";
import { requireUser } from "@/server/auth/current-user";
import { getMovementById } from "@/server/movements/movements-service";
import { buildMovementsHref, parseMovementsFilters } from "@/shared/movements";

const getMovement = cache(async (id: string) => {
  const user = await requireUser();
  return getMovementById(user.id, id);
});

/** Uses the counterparty as the page title. */
export async function generateMetadata({
  params,
}: PageProps<"/movimientos/[id]">): Promise<Metadata> {
  const movement = await getMovement((await params).id);
  return { title: movement?.counterparty ?? "Movimiento no encontrado" };
}

/** Movement detail screen; unknown or foreign ids render the not-found screen with a 404 status. */
export default async function MovementDetailPage({
  params,
  searchParams,
}: PageProps<"/movimientos/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const movement = await getMovement(id);
  if (!movement) {
    notFound();
  }
  // The list passes its filters in `from`, so the back arrow returns to the same view.
  const from = new URLSearchParams(firstParam(query.from) ?? "");
  const backHref = buildMovementsHref(parseMovementsFilters((name) => from.get(name))) as Route;
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title="Detalle" backHref={backHref} backLabel="Volver a movimientos" />
      <MovementDetail movement={movement} />
    </div>
  );
}
