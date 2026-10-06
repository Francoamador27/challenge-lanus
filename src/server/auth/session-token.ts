import "server-only";
import { createHash, randomBytes } from "node:crypto";

/** Generates a random 256-bit, URL-safe session token. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Hashes a session token so the database never stores the raw value. */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
