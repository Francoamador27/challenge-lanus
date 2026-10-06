import { Skeleton } from "@/components/ui/skeleton";
import { MovementListSkeleton } from "@/features/movements/components/movement-list-skeleton";

const CHIP_WIDTHS = [64, 96, 88, 84];

/** Skeleton for the movements screen while the first page loads. */
export default function MovementsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <p role="status" className="sr-only">
        Cargando movimientos…
      </p>
      <Skeleton className="h-6 w-36" />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          {CHIP_WIDTHS.map((width) => (
            <Skeleton key={width} className="h-9 rounded-full" style={{ width }} />
          ))}
        </div>
        <MovementListSkeleton rows={6} />
      </div>
    </div>
  );
}
