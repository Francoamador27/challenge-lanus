import type { Money } from "@/shared/money";

export const CARD_BRANDS = ["mastercard", "visa"] as const;
export type CardBrand = (typeof CARD_BRANDS)[number];

export type CardDTO = {
  id: string;
  brand: CardBrand;
  last4: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  balance: Money;
};
