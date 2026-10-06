import { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/shared/session-cookie";

/** Builds a Route Handler request, optionally authenticated with a session token. */
export function apiRequest(path: string, token?: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost"), {
    headers: token ? { cookie: `${SESSION_COOKIE}=${token}` } : {},
  });
}
