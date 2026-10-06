import { Skeleton } from "@/components/ui/skeleton";
import { MovementListSkeleton } from "@/features/movements/components/movement-list-skeleton";

/** Skeleton for the home screen while its data loads. */
export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-8">
      <p role="status" className="sr-only">
        Cargando tu información…
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="size-11 rounded-full" />
      </div>
      <Skeleton className="h-45 w-[85%] rounded-bank-card" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-40" />
        <MovementListSkeleton rows={4} />
      </div>
    </div>
  );
}
