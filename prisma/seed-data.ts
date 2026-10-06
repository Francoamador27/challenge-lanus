import type { CardBrand, MovementType } from "../src/generated/prisma/enums";

export type SeedCard = {
  key: "mastercard" | "visa";
  brand: CardBrand;
  last4: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  balanceCents: number;
};

export type SeedMovement = {
  counterparty: string;
  type: MovementType;
  amountCents: number;
  minutesAgo: number;
  card?: SeedCard["key"];
};

const HOUR = 60;
const DAY = 24 * HOUR;

/** Demo cards, in the order the home carousel shows them. */
export const SEED_CARDS: SeedCard[] = [
  {
    key: "mastercard",
    brand: "MASTERCARD",
    last4: "1234",
    holderName: "Soy Granate",
    expMonth: 2,
    expYear: 2030,
    balanceCents: 97_885,
  },
  {
    key: "visa",
    brand: "VISA",
    last4: "5678",
    holderName: "Soy Granate",
    expMonth: 11,
    expYear: 2028,
    balanceCents: 45_020,
  },
];

/** Demo movements, newest first; the first four match the home screen of the design. */
// prettier-ignore
export const SEED_MOVEMENTS: SeedMovement[] = [
  { counterparty: "Adobe", type: "AUTO_DEBIT", amountCents: 12_500, minutesAgo: 2 * HOUR, card: "mastercard" },
  { counterparty: "Ronaldo", type: "RECEIVED", amountCents: 9_500, minutesAgo: 5 * HOUR },
  { counterparty: "Figma", type: "AUTO_DEBIT", amountCents: 12_500, minutesAgo: DAY + 3 * HOUR, card: "mastercard" },
  { counterparty: "Juan Perez", type: "SENT", amountCents: 8_500, minutesAgo: DAY + 7 * HOUR },
  { counterparty: "José Suárez", type: "RECEIVED", amountCents: 9_500, minutesAgo: 2 * DAY + 2 * HOUR },
  { counterparty: "Juan Rodríguez", type: "SENT", amountCents: 9_500, minutesAgo: 3 * DAY + 5 * HOUR },
  { counterparty: "Julio César", type: "RECEIVED", amountCents: 9_500, minutesAgo: 4 * DAY + HOUR },
  { counterparty: "Mariano Martínez", type: "SENT", amountCents: 9_500, minutesAgo: 5 * DAY + 6 * HOUR },
  { counterparty: "Netflix", type: "AUTO_DEBIT", amountCents: 1_549, minutesAgo: 6 * DAY + 4 * HOUR, card: "mastercard" },
  { counterparty: "Spotify", type: "AUTO_DEBIT", amountCents: 1_199, minutesAgo: 7 * DAY + 2 * HOUR, card: "visa" },
  { counterparty: "Cuota social Club Lanús", type: "AUTO_DEBIT", amountCents: 3_000, minutesAgo: 8 * DAY + 9 * HOUR, card: "mastercard" },
  { counterparty: "Juan Cabrero", type: "RECEIVED", amountCents: 9_500, minutesAgo: 9 * DAY + 3 * HOUR },
  { counterparty: "Jorge Álvarez", type: "SENT", amountCents: 9_500, minutesAgo: 10 * DAY + 5 * HOUR },
  { counterparty: "María González", type: "RECEIVED", amountCents: 25_000, minutesAgo: 12 * DAY + HOUR },
  { counterparty: "Disney+", type: "AUTO_DEBIT", amountCents: 1_399, minutesAgo: 13 * DAY + 8 * HOUR, card: "visa" },
  { counterparty: "Lucía Fernández", type: "SENT", amountCents: 4_000, minutesAgo: 14 * DAY + 4 * HOUR },
  { counterparty: "YouTube Premium", type: "AUTO_DEBIT", amountCents: 1_399, minutesAgo: 15 * DAY + 2 * HOUR, card: "visa" },
  { counterparty: "Martín López", type: "RECEIVED", amountCents: 6_000, minutesAgo: 17 * DAY + 6 * HOUR },
  { counterparty: "iCloud+", type: "AUTO_DEBIT", amountCents: 299, minutesAgo: 18 * DAY + 3 * HOUR, card: "mastercard" },
  { counterparty: "Sofía Romero", type: "SENT", amountCents: 12_000, minutesAgo: 20 * DAY + 5 * HOUR },
  { counterparty: "Amazon Prime", type: "AUTO_DEBIT", amountCents: 1_499, minutesAgo: 22 * DAY + 2 * HOUR, card: "visa" },
  { counterparty: "Diego Sánchez", type: "RECEIVED", amountCents: 7_550, minutesAgo: 24 * DAY + 7 * HOUR },
  { counterparty: "Valentina Torres", type: "SENT", amountCents: 3_300, minutesAgo: 26 * DAY + HOUR },
  { counterparty: "Adobe", type: "AUTO_DEBIT", amountCents: 12_500, minutesAgo: 31 * DAY + 2 * HOUR, card: "mastercard" },
  { counterparty: "Figma", type: "AUTO_DEBIT", amountCents: 12_500, minutesAgo: 32 * DAY + 3 * HOUR, card: "mastercard" },
  { counterparty: "Nicolás Díaz", type: "RECEIVED", amountCents: 18_000, minutesAgo: 34 * DAY + 4 * HOUR },
  { counterparty: "Netflix", type: "AUTO_DEBIT", amountCents: 1_549, minutesAgo: 36 * DAY + 4 * HOUR, card: "mastercard" },
  { counterparty: "Spotify", type: "AUTO_DEBIT", amountCents: 1_199, minutesAgo: 37 * DAY + 2 * HOUR, card: "visa" },
  { counterparty: "Camila Ruiz", type: "SENT", amountCents: 5_200, minutesAgo: 38 * DAY + 6 * HOUR },
  { counterparty: "Cuota social Club Lanús", type: "AUTO_DEBIT", amountCents: 3_000, minutesAgo: 39 * DAY + 9 * HOUR, card: "mastercard" },
  { counterparty: "Federico Gómez", type: "RECEIVED", amountCents: 9_500, minutesAgo: 41 * DAY + 2 * HOUR },
  { counterparty: "Agustina Pereyra", type: "SENT", amountCents: 4_500, minutesAgo: 44 * DAY + 5 * HOUR },
  { counterparty: "Disney+", type: "AUTO_DEBIT", amountCents: 1_399, minutesAgo: 45 * DAY + 8 * HOUR, card: "visa" },
  { counterparty: "YouTube Premium", type: "AUTO_DEBIT", amountCents: 1_399, minutesAgo: 46 * DAY + 2 * HOUR, card: "visa" },
  { counterparty: "Tomás Medina", type: "RECEIVED", amountCents: 11_000, minutesAgo: 48 * DAY + 3 * HOUR },
  { counterparty: "Julieta Castro", type: "SENT", amountCents: 7_000, minutesAgo: 52 * DAY + HOUR },
];
