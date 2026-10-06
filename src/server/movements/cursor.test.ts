import { describe, expect, it } from "vitest";
import { decodeCursor, encodeCursor } from "./cursor";

const POSITION = {
  occurredAt: new Date("2026-10-06T15:32:00.000Z"),
  id: "0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e",
};

const base64url = (value: string) => Buffer.from(value).toString("base64url");

describe("movement cursors", () => {
  it("round-trips a position", () => {
    expect(decodeCursor(encodeCursor(POSITION))).toEqual(POSITION);
  });

  it("is opaque and URL-safe", () => {
    expect(encodeCursor(POSITION)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it.each([
    "",
    "not-base64!",
    base64url("2026-10-06T15:32:00.000Z|not-a-uuid"),
    base64url("yesterday|0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e"),
    base64url("2026-10-06T15:32:00.000Z|0b7c4c55-5d3e-4a6c-9d1e-3f2a1b0c9d8e|extra"),
  ])("rejects malformed cursor %#", (value) => {
    expect(decodeCursor(value)).toBeNull();
  });
});
