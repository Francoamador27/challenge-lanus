import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "./redirect";

describe("getSafeRedirectPath", () => {
  it("keeps same-origin paths with their query string", () => {
    expect(getSafeRedirectPath("/movimientos?q=adobe&type=sent")).toBe(
      "/movimientos?q=adobe&type=sent",
    );
  });

  it.each([
    [undefined],
    [null],
    [""],
    ["movimientos"],
    ["https://evil.com"],
    ["//evil.com"],
    ["/\\evil.com"],
    ["/login"],
    ["/login?next=/movimientos"],
    // Browsers drop tabs and newlines while parsing URLs, turning these into "//evil.com".
    ["/\t/evil.com"],
    ["/\t\\evil.com"],
    ["/\n/evil.com"],
    ["/\r/evil.com"],
  ])("falls back to / for %j", (next) => {
    expect(getSafeRedirectPath(next)).toBe("/");
  });
});
