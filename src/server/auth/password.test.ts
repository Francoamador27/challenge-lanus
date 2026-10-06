import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("produces an Argon2id hash that verifies only the original password", async () => {
    const hash = await hashPassword("GRANATE1@");
    expect(hash).toMatch(/^\$argon2id\$/);
    expect(await verifyPassword(hash, "GRANATE1@")).toBe(true);
    expect(await verifyPassword(hash, "granate1@")).toBe(false);
  });

  it("salts every hash", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("treats a malformed hash as a failed check instead of throwing", async () => {
    expect(await verifyPassword("not-a-hash", "anything")).toBe(false);
  });
});
