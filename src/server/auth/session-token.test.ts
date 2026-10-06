import { describe, expect, it } from "vitest";
import { generateSessionToken, hashSessionToken } from "./session-token";

describe("session tokens", () => {
  it("generates 256-bit URL-safe tokens that never repeat", () => {
    const token = generateSessionToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(generateSessionToken()).not.toBe(token);
  });

  it("hashes tokens deterministically as SHA-256 hex", () => {
    const hash = hashSessionToken("token");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hashSessionToken("token")).toBe(hash);
    expect(hashSessionToken("other")).not.toBe(hash);
  });
});
