import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/shared/money";
import type { MovementType } from "@/shared/movements";
import { MOVEMENT_TYPE_COPY } from "../labels";

const AMOUNT_COLOR: Record<MovementType, string> = {
  auto_debit: "text-debit",
  received: "text-received",
  sent: "text-sent",
};

/** Amount colored by movement type, with its direction spelled out for screen readers. */
export function MovementAmount({
  type,
  amount,
  className,
}: {
  type: MovementType;
  amount: Money;
  className?: string;
}) {
  return (
    <span
      className={cn("font-semibold whitespace-nowrap tabular-nums", AMOUNT_COLOR[type], className)}
    >
      <span className="sr-only">
        {MOVEMENT_TYPE_COPY[type].isIncome ? "Ingreso de " : "Egreso de "}
      </span>
      {formatMoney(amount.cents, amount.currency)}
    </span>
  );
}
