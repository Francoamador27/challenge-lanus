import "server-only";
import type { Route } from "next";

/** Returns `next` when it is a safe same-origin path other than the login page, otherwise `/`. */
export function getSafeRedirectPath(next: string | null | undefined): Route {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  const pathname = next.split(/[?#]/, 1)[0];
  if (pathname === "/login") {
    return "/";
  }
  // Validated above as a same-origin path; typed routes cannot know it statically.
  return next as Route;
}
