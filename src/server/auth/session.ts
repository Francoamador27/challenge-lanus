import "server-only";
import { generateSessionToken, hashSessionToken } from "@/server/auth/session-token";
import { db } from "@/server/db";

const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000;
const REMEMBER_ME_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type SessionUser = { id: string; email: string; displayName: string };
export type ValidSession = { id: string; expiresAt: Date; user: SessionUser };

/** Creates a session for the user and returns the raw token, which only the cookie keeps. */
export async function createSession(
  userId: string,
  { remember }: { remember: boolean },
  now: Date = new Date(),
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = new Date(now.getTime() + (remember ? REMEMBER_ME_TTL_MS : DEFAULT_TTL_MS));
  await db.session.create({ data: { tokenHash: hashSessionToken(token), userId, expiresAt } });
  return { token, expiresAt };
}

/** Resolves a raw token to its session and user; expired sessions are deleted and rejected. */
export async function validateSessionToken(
  token: string,
  now: Date = new Date(),
): Promise<ValidSession | null> {
  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      id: true,
      expiresAt: true,
      user: { select: { id: true, email: true, displayName: true } },
    },
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt <= now) {
    await db.session.deleteMany({ where: { id: session.id } });
    return null;
  }
  return session;
}

/** Deletes the session identified by the raw token, if it still exists. */
export async function invalidateSession(token: string): Promise<void> {
  await db.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}

/** Cookie attributes for the session cookie; a null expiry makes it last until the browser closes. */
export function sessionCookieOptions({
  expiresAt,
  secure,
}: {
  expiresAt: Date | null;
  secure: boolean;
}) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    ...(expiresAt ? { expires: expiresAt } : {}),
  };
}
