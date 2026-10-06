import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { authenticate } from "@/server/auth/authenticate";
import { getUserFromRequest } from "@/server/auth/current-user";
import { hashPassword } from "@/server/auth/password";
import { createSession, invalidateSession, validateSessionToken } from "@/server/auth/session";
import { db } from "@/server/db";
import { SESSION_COOKIE } from "@/shared/session-cookie";
import { createUser } from "./helpers/factories";
import { resetDatabase } from "./helpers/reset-database";

const HOUR_MS = 60 * 60 * 1000;

describe("sessions", () => {
  beforeEach(resetDatabase);

  it("creates a session that resolves to its user", async () => {
    const user = await createUser({ displayName: "Granate" });
    const { token } = await createSession(user.id, { remember: false });
    const session = await validateSessionToken(token);
    expect(session?.user).toEqual({ id: user.id, email: user.email, displayName: "Granate" });
  });

  it("stores only the token hash", async () => {
    const user = await createUser();
    const { token } = await createSession(user.id, { remember: false });
    const stored = await db.session.findFirstOrThrow();
    expect(stored.tokenHash).not.toBe(token);
    expect(stored.tokenHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects unknown tokens", async () => {
    expect(await validateSessionToken("unknown")).toBeNull();
  });

  it("lasts 12 hours by default and 30 days when remembered", async () => {
    const user = await createUser();
    const now = new Date("2026-01-01T00:00:00.000Z");
    const short = await createSession(user.id, { remember: false }, now);
    const long = await createSession(user.id, { remember: true }, now);
    expect(short.expiresAt.getTime() - now.getTime()).toBe(12 * HOUR_MS);
    expect(long.expiresAt.getTime() - now.getTime()).toBe(30 * 24 * HOUR_MS);
  });

  it("treats expired sessions as invalid and deletes them", async () => {
    const user = await createUser();
    const { token, expiresAt } = await createSession(user.id, { remember: false });
    expect(await validateSessionToken(token, new Date(expiresAt.getTime() + 1))).toBeNull();
    expect(await db.session.count()).toBe(0);
  });

  it("revokes a session on logout", async () => {
    const user = await createUser();
    const { token } = await createSession(user.id, { remember: true });
    await invalidateSession(token);
    expect(await validateSessionToken(token)).toBeNull();
  });
});

describe("authenticate", () => {
  beforeEach(resetDatabase);

  it("returns the user for valid credentials and null otherwise", async () => {
    const user = await createUser({
      email: "soygranate@clublanus.com",
      passwordHash: await hashPassword("GRANATE1@"),
    });
    expect(await authenticate("soygranate@clublanus.com", "GRANATE1@")).toEqual({ id: user.id });
    expect(await authenticate("soygranate@clublanus.com", "wrong")).toBeNull();
    expect(await authenticate("nobody@clublanus.com", "GRANATE1@")).toBeNull();
  });
});

describe("getUserFromRequest", () => {
  beforeEach(resetDatabase);

  it("reads the session cookie from the request", async () => {
    const user = await createUser();
    const { token } = await createSession(user.id, { remember: false });
    const request = new NextRequest("http://localhost/api/v1/movements", {
      headers: { cookie: `${SESSION_COOKIE}=${token}` },
    });
    expect((await getUserFromRequest(request))?.id).toBe(user.id);
  });

  it("returns null without a cookie", async () => {
    expect(
      await getUserFromRequest(new NextRequest("http://localhost/api/v1/movements")),
    ).toBeNull();
  });
});
