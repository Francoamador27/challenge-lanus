import { describe, expect, it } from "vitest";
import { normalizeSearchText } from "./search";

describe("normalizeSearchText", () => {
  it("removes accents, lowercases and collapses whitespace", () => {
    expect(normalizeSearchText("  José   SUÁREZ ")).toBe("jose suarez");
  });

  it("folds ñ and ü so users can type without special keys", () => {
    expect(normalizeSearchText("Ñandú Güemes")).toBe("nandu guemes");
  });

  it("keeps punctuation and symbols untouched", () => {
    expect(normalizeSearchText("Disney+ 100%")).toBe("disney+ 100%");
  });
});
