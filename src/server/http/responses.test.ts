import { describe, expect, it } from "vitest";
import { z } from "zod";
import { privateJsonResponse, problemResponse, toProblemErrors } from "./responses";

describe("problemResponse", () => {
  it("returns RFC 9457 problem details that are never cached", async () => {
    const response = problemResponse({
      status: 404,
      title: "Not Found",
      detail: "Movement not found",
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("application/problem+json");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({
      type: "about:blank",
      title: "Not Found",
      status: 404,
      detail: "Movement not found",
    });
  });
});

describe("privateJsonResponse", () => {
  it("returns JSON that browsers and CDNs must not cache", async () => {
    const response = privateJsonResponse({ ok: true });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ ok: true });
  });
});

describe("toProblemErrors", () => {
  it("flattens Zod issues into path and message pairs", () => {
    const result = z.object({ limit: z.number() }).safeParse({ limit: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toProblemErrors(result.error)).toEqual([
        { path: "limit", message: expect.any(String) },
      ]);
    }
  });
});
