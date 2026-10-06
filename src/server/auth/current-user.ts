import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { cache } from "react";
import { validateSessionToken, type SessionUser, type ValidSession } from "@/server/auth/session";
import { SESSION_COOKIE } from "@/shared/session-cookie";

/** Returns the current request's valid session, memoized for the duration of the request. */
export const getCurrentSession = cache(async (): Promise<ValidSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? validateSessionToken(token) : null;
});

/** Returns the signed-in user, or redirects to the login screen when there is no valid session. */
export async function requireUser(): Promise<SessionUser> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }
  return session.user;
}

/** Resolves the user from a Route Handler request's session cookie, or null. */
export async function getUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return (await validateSessionToken(token))?.user ?? null;
}
