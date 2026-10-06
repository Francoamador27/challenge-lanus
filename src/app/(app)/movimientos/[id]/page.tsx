import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ScreenHeader } from "@/components/layout/screen-header";
import { MovementDetail } from "@/features/movements/components/movement-detail";
import { requireUser } from "@/server/auth/current-user";
import { getMovementById } from "@/server/movements/movements-service";

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
export default async function MovementDetailPage({ params }: PageProps<"/movimientos/[id]">) {
  const movement = await getMovement((await params).id);
  if (!movement) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title="Detalle" backHref="/movimientos" backLabel="Volver a movimientos" />
      <MovementDetail movement={movement} />
    </div>
  );
}
