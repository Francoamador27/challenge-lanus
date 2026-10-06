import { CARD_BRAND_NAME } from "@/features/cards/brand";
import { formatDate, formatTime } from "@/lib/format";
import type { MovementDTO } from "@/shared/movements";
import { MOVEMENT_TYPE_COPY } from "../labels";
import { MovementAmount } from "./movement-amount";
import { MovementIcon } from "./movement-icon";

/** Everything known about one movement: who, how much, when, how and its operation number. */
export function MovementDetail({ movement }: { movement: MovementDTO }) {
  const copy = MOVEMENT_TYPE_COPY[movement.type];
  const rows = [
    { label: "Fecha", value: formatDate(movement.occurredAt) },
    { label: "Hora", value: formatTime(movement.occurredAt) },
    { label: "Tipo", value: copy.detail },
    ...(movement.card
      ? [
          {
            label: "Medio de pago",
            value: `${CARD_BRAND_NAME[movement.card.brand]} •••• ${movement.card.last4}`,
          },
        ]
      : []),
    { label: "N° de operación", value: movement.reference },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <MovementIcon type={movement.type} size="lg" />
        <h1 className="text-xl font-semibold text-ink">{movement.counterparty}</h1>
        <p className="text-sm text-subtle">{copy.detail}</p>
        <MovementAmount
          type={movement.type}
          amount={movement.amount}
          className="text-[32px] leading-tight"
        />
      </div>
      <dl className="divide-y divide-line rounded-card bg-surface px-5 shadow-card">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-subtle">{row.label}</dt>
            <dd className="text-right text-sm font-medium text-ink tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
