const TIME_ZONE = "America/Argentina/Buenos_Aires";

/** Formats integer cents as currency the way the design shows it: `$125` or `$12.99`. */
export function formatMoney(cents: number, currency: string): string {
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Formats integer cents as a plain amount with two decimals: `978.85`. */
export function formatAmount(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Formats an ISO date as a long Spanish date in Buenos Aires: `6 de octubre de 2026`. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}

/** Formats an ISO date as a 24-hour time in Buenos Aires: `12:32 h`. */
export function formatTime(iso: string): string {
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
  return `${time} h`;
}

/** Formats a card expiry as `MM/YY`. */
export function formatCardExpiry(month: number, year: number): string {
  return `${String(month).padStart(2, "0")}/${String(year % 100).padStart(2, "0")}`;
}

/** Masks a card number, keeping only its last four digits visible. */
export function maskCardNumber(last4: string): string {
  return `**** **** **** ${last4}`;
}
