import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { MovementDTO } from "@/shared/movements";
import { MovementList } from "./movement-list";

/** "Últimos movimientos" section of the home screen. */
export function LatestMovements({ movements }: { movements: MovementDTO[] }) {
  return (
    <section aria-labelledby="latest-movements-title" className="flex flex-col gap-4">
      <h2 id="latest-movements-title" className="text-base font-semibold text-ink">
        Últimos movimientos
      </h2>
      {movements.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Todavía no tenés movimientos"
          description="Cuando uses tus tarjetas, vas a verlos acá."
        />
      ) : (
        <MovementList movements={movements} />
      )}
    </section>
  );
}
