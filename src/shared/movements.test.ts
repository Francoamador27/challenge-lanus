import { describe, expect, it } from "vitest";
import {
  buildMovementsHref,
  listMovementsQuerySchema,
  parseMovementsFilters,
  toMovementsSearch,
} from "./movements";

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

describe("parseMovementsFilters", () => {
  const from = (search: string) => {
    const params = new URLSearchParams(search);
    return parseMovementsFilters((name) => params.get(name));
  };

  it("reads a valid search and type", () => {
    expect(from("q=%20juan%20&type=received")).toEqual({ q: "juan", type: "received" });
  });

  it("keeps each valid field when the other one is invalid", () => {
    expect(from(`q=${"a".repeat(51)}&type=sent`)).toEqual({ q: undefined, type: "sent" });
    expect(from("q=adobe&type=refund")).toEqual({ q: "adobe", type: undefined });
  });

  it("treats missing and whitespace-only values as no filter", () => {
    expect(from("q=%20%20")).toEqual({ q: undefined, type: undefined });
    expect(from("")).toEqual({ q: undefined, type: undefined });
  });
});

describe("toMovementsSearch and buildMovementsHref", () => {
  it("serializes only the filters that are set, in a stable order", () => {
    expect(toMovementsSearch({ type: "received", q: "juan" })).toBe("q=juan&type=received");
    expect(toMovementsSearch({ q: "José Suárez" })).toBe("q=Jos%C3%A9+Su%C3%A1rez");
    expect(toMovementsSearch({})).toBe("");
  });

  it("builds the movements URL for a set of filters", () => {
    expect(buildMovementsHref({ q: "juan", type: "received" })).toBe(
      "/movimientos?q=juan&type=received",
    );
    expect(buildMovementsHref({})).toBe("/movimientos");
  });
});
