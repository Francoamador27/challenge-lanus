/** Gold chip with the account currency, as on the design's card. */
export function CurrencyBadge({ currency }: { currency: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md bg-linear-to-br from-gold-500 to-gold-300 px-2 text-[11px] font-semibold tracking-wide text-granate-900">
      {currency}
    </span>
  );
}
