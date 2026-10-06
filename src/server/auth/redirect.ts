import "server-only";
import type { Route } from "next";

const INTERNAL_ORIGIN = "http://granabank.invalid";

/** Whether the value contains control characters or backslashes, which browsers may normalize into another URL. */
function hasUnsafeCharacters(value: string): boolean {
  return [...value].some((char) => {
    const code = char.charCodeAt(0);
    return code < 0x20 || code === 0x7f || char === "\\";
  });
}

/** Returns `next` when it resolves to a same-origin path other than the login page, otherwise `/`. */
export function getSafeRedirectPath(next: string | null | undefined): Route {
  if (!next || !next.startsWith("/") || next.startsWith("//") || hasUnsafeCharacters(next)) {
    return "/";
  }
  let url: URL;
  try {
    url = new URL(next, INTERNAL_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== INTERNAL_ORIGIN || url.pathname === "/login") {
    return "/";
  }
  // Re-serialized from the parsed URL, so it is a same-origin path; typed routes cannot know it statically.
  return `${url.pathname}${url.search}${url.hash}` as Route;
}
