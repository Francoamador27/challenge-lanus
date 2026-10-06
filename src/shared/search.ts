/** Normalizes free text for accent- and case-insensitive matching ("  José  SUÁREZ " → "jose suarez"). */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
