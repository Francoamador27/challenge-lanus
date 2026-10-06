import "server-only";
import { hash, verify } from "@node-rs/argon2";

// OWASP baseline for Argon2id: 19 MiB of memory, 2 iterations, 1 degree of parallelism.
const HASH_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };

/** Hashes a plain-text password with Argon2id (the library default algorithm). */
export function hashPassword(plain: string): Promise<string> {
  return hash(plain, HASH_OPTIONS);
}

/** Checks a password against an Argon2id hash, returning false for malformed hashes. */
export async function verifyPassword(passwordHash: string, plain: string): Promise<boolean> {
  try {
    return await verify(passwordHash, plain);
  } catch {
    return false;
  }
}
