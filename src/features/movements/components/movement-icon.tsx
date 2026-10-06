import { ArrowDown, ArrowDownUp, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MovementType } from "@/shared/movements";

const STYLES: Record<MovementType, { tile: string; icon: string; Icon: LucideIcon }> = {
  auto_debit: { tile: "bg-debit-soft", icon: "text-debit-icon", Icon: ArrowDownUp },
  received: { tile: "bg-received-soft", icon: "text-received", Icon: ArrowDown },
  sent: { tile: "bg-sent-soft", icon: "text-sent-icon", Icon: ArrowUp },
};

/** Colored tile with the arrow that identifies a movement type. */
export function MovementIcon({ type, size = "md" }: { type: MovementType; size?: "md" | "lg" }) {
  const { tile, icon, Icon } = STYLES[type];
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-tile",
        tile,
        size === "md" ? "size-11" : "size-16",
      )}
    >
      <Icon className={cn(icon, size === "md" ? "size-5" : "size-7")} strokeWidth={2.5} />
    </span>
  );
}
