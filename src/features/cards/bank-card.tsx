import { cn } from "@/lib/cn";
import { formatAmount, formatCardExpiry, maskCardNumber } from "@/lib/format";
import type { CardDTO } from "@/shared/cards";
import { CARD_BRAND_NAME } from "./brand";
import { BrandLogo } from "./brand-logo";
import { CurrencyBadge } from "./currency-badge";

const THEMES = [
  { surface: "bg-granate-700 text-white", muted: "text-white/80" },
  { surface: "bg-rose-300 text-granate-900", muted: "text-granate-900/80" },
] as const;

/** Payment card with balance, masked number, holder and expiry; themes alternate by position. */
export function BankCard({ card, themeIndex }: { card: CardDTO; themeIndex: number }) {
  const theme = THEMES[themeIndex % THEMES.length] ?? THEMES[0];
  const balance = formatAmount(card.balance.cents);
  return (
    <article
      aria-label={`Tarjeta ${CARD_BRAND_NAME[card.brand]} terminada en ${card.last4}, saldo ${card.balance.currency} ${balance}`}
      className={cn(
        "flex h-45 w-full flex-col justify-between rounded-bank-card p-5 shadow-card",
        theme.surface,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className={cn("text-xs", theme.muted)}>Balance</span>
          <div className="flex items-center gap-2">
            <CurrencyBadge currency={card.balance.currency} />
            <span className="text-2xl font-semibold tabular-nums">{balance}</span>
          </div>
        </div>
        <BrandLogo brand={card.brand} className="h-6 w-auto" />
      </div>
      <p aria-hidden className="text-sm font-medium tracking-[0.2em]">
        {maskCardNumber(card.last4)}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-[13px] font-medium">{card.holderName}</span>
        <div className="flex flex-col items-end">
          <span className={cn("text-[9px] uppercase", theme.muted)}>Exp Date</span>
          <span className="text-xs font-medium tabular-nums">
            {formatCardExpiry(card.expMonth, card.expYear)}
          </span>
        </div>
      </div>
    </article>
  );
}
