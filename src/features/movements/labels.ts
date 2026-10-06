import type { MovementType } from "@/shared/movements";

/** UI copy for each movement type. */
export const MOVEMENT_TYPE_COPY: Record<
  MovementType,
  { subtitle: string; filter: string; detail: string; isIncome: boolean }
> = {
  auto_debit: {
    subtitle: "Pago de suscripción",
    filter: "Débito Aut.",
    detail: "Débito automático",
    isIncome: false,
  },
  received: {
    subtitle: "Pago recibido",
    filter: "Recibido",
    detail: "Pago recibido",
    isIncome: true,
  },
  sent: {
    subtitle: "Pago enviado",
    filter: "Enviado",
    detail: "Pago enviado",
    isIncome: false,
  },
};
