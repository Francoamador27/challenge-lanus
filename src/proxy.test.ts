import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { SESSION_COOKIE } from "@/shared/session-cookie";
import { proxy } from "./proxy";

describe("proxy", () => {
  it("sends visitors without a session cookie to login, remembering where they were going", () => {
    const response = proxy(new NextRequest("http://localhost/movimientos?q=adobe"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?next=%2Fmovimientos%3Fq%3Dadobe",
    );
  });

  it("does not add next for the home page", () => {
    expect(proxy(new NextRequest("http://localhost/")).headers.get("location")).toBe(
      "http://localhost/login",
    );
  });

  it("lets requests with a session cookie through; pages validate the session themselves", () => {
    const request = new NextRequest("http://localhost/movimientos", {
      headers: { cookie: `${SESSION_COOKIE}=token` },
    });
    expect(proxy(request).headers.get("x-middleware-next")).toBe("1");
  });

  it("never redirects the login page", () => {
    expect(proxy(new NextRequest("http://localhost/login")).headers.get("x-middleware-next")).toBe(
      "1",
    );
  });
});
