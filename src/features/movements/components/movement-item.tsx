import Link from "next/link";
import { LinkPendingIndicator } from "@/components/ui/link-pending-indicator";
import type { MovementDTO } from "@/shared/movements";
import { MOVEMENT_TYPE_COPY } from "../labels";
import { MovementAmount } from "./movement-amount";
import { MovementIcon } from "./movement-icon";

/** Tappable movement row that opens its detail screen. */
export function MovementItem({ movement }: { movement: MovementDTO }) {
  return (
    <Link
      href={`/movimientos/${movement.id}`}
      className="relative flex items-center gap-4 rounded-card bg-surface p-4 shadow-card transition-colors hover:bg-granate-100/30"
    >
      <MovementIcon type={movement.type} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-medium text-body">{movement.counterparty}</span>
        <span className="truncate text-xs text-subtle">
          {MOVEMENT_TYPE_COPY[movement.type].subtitle}
        </span>
      </span>
      <MovementAmount type={movement.type} amount={movement.amount} className="text-sm" />
      <LinkPendingIndicator />
    </Link>
  );
}
