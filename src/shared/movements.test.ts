import { describe, expect, it } from "vitest";
import { listMovementsQuerySchema } from "./movements";

describe("listMovementsQuerySchema", () => {
  it("applies defaults when nothing is given", () => {
    const query = listMovementsQuerySchema.parse({});
    expect(query.limit).toBe(20);
    expect(query.q).toBeUndefined();
    expect(query.type).toBeUndefined();
  });

  it("trims the search and treats whitespace-only text as no search", () => {
    expect(listMovementsQuerySchema.parse({ q: "  adobe " }).q).toBe("adobe");
    expect(listMovementsQuerySchema.parse({ q: "   " }).q).toBeUndefined();
  });

  it("coerces the limit and rejects out-of-range values", () => {
    expect(listMovementsQuerySchema.parse({ limit: "5" }).limit).toBe(5);
    expect(listMovementsQuerySchema.safeParse({ limit: "0" }).success).toBe(false);
    expect(listMovementsQuerySchema.safeParse({ limit: "51" }).success).toBe(false);
  });

  it("only accepts known movement types", () => {
    expect(listMovementsQuerySchema.parse({ type: "received" }).type).toBe("received");
    expect(listMovementsQuerySchema.safeParse({ type: "RECEIVED" }).success).toBe(false);
  });

  it("rejects searches longer than 50 characters", () => {
    expect(listMovementsQuerySchema.safeParse({ q: "a".repeat(51) }).success).toBe(false);
  });
});
