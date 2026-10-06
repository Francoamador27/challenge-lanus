import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("accepts a postgres connection string and defaults NODE_ENV to development", () => {
    expect(parseEnv({ DATABASE_URL: "postgresql://u:p@localhost:5432/db" })).toEqual({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      NODE_ENV: "development",
    });
  });

  it("names DATABASE_URL when it is missing or not a postgres URL", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
    expect(() => parseEnv({ DATABASE_URL: "mysql://localhost/db" })).toThrow(/DATABASE_URL/);
  });
});
