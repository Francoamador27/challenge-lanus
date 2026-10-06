import { SearchX } from "lucide-react";
import Link from "next/link";
import { ScreenHeader } from "@/components/layout/screen-header";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/** Shown when a movement does not exist or belongs to another user. */
export default function MovementNotFound() {
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title="Detalle" backHref="/movimientos" backLabel="Volver a movimientos" />
      <EmptyState
        titleAs="h1"
        icon={<SearchX className="size-6" />}
        title="No encontramos este movimiento"
        description="Puede que no exista o que no tengas acceso."
        action={
          <Link href="/movimientos" className={buttonVariants({ variant: "secondary" })}>
            Volver a movimientos
          </Link>
        }
      />
    </div>
  );
}
