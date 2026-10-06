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
  ])("falls back to / for %s", (next) => {
    expect(getSafeRedirectPath(next)).toBe("/");
  });
});
