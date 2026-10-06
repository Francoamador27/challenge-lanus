import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder rows matching the movement list layout. */
export function MovementListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul aria-hidden className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card">
          <Skeleton className="size-11 rounded-tile" />
          <span className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </span>
          <Skeleton className="h-3.5 w-12" />
        </li>
      ))}
    </ul>
  );
}
