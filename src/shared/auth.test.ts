import { describe, expect, it } from "vitest";
import { loginSchema } from "./auth";

function messages(input: unknown) {
  const result = loginSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("loginSchema", () => {
  it("trims and lowercases the email", () => {
    expect(
      loginSchema.parse({
        email: "  SoyGranate@ClubLanus.com ",
        password: "GRANATE1@",
        remember: true,
      }),
    ).toEqual({ email: "soygranate@clublanus.com", password: "GRANATE1@", remember: true });
  });

  it("asks for each missing field in Spanish", () => {
    expect(messages({ email: "", password: "", remember: false })).toEqual([
      "Ingresá tu email",
      "Ingresá tu contraseña",
    ]);
  });

  it("rejects malformed emails", () => {
    expect(messages({ email: "soygranate", password: "x", remember: false })).toEqual([
      "Ingresá un email válido",
    ]);
  });

  it("defaults remember to false", () => {
    expect(loginSchema.parse({ email: "a@b.com", password: "x" }).remember).toBe(false);
  });
});
