import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required" })
    .regex(/^postgres(ql)?:\/\//, { error: "DATABASE_URL must be a postgres:// URL" }),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/** Validates raw environment variables, failing with a message that names each invalid one. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

let cachedEnv: Env | undefined;

/** Returns the validated environment, parsing `process.env` on first use. */
export function getEnv(): Env {
  cachedEnv ??= parseEnv(process.env);
  return cachedEnv;
}
