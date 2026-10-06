import type { CardBrand } from "@/shared/cards";

/** Card network logo drawn inline, so it needs no network request. */
export function BrandLogo({ brand, className }: { brand: CardBrand; className?: string }) {
  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 32 20" role="img" aria-label="Mastercard" className={className}>
        <circle cx="12" cy="10" r="8" fill="#EB001B" />
        <circle cx="20" cy="10" r="8" fill="#F79E1B" />
        <path d="M16 3.07A8 8 0 0 1 16 16.93A8 8 0 0 1 16 3.07Z" fill="#FF5F00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 20" role="img" aria-label="Visa" className={className}>
      <rect width="40" height="20" rx="4" className="fill-visa" />
      <text
        x="20"
        y="14.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fontStyle="italic"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}
