import { z } from "zod";

/** Validation for the login form; messages are user-facing. */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Ingresá tu email" })
    .pipe(z.email({ error: "Ingresá un email válido" })),
  password: z.string().min(1, { error: "Ingresá tu contraseña" }),
  remember: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginState = {
  status: "idle" | "error";
  email: string;
  remember: boolean;
  fieldErrors?: { email?: string; password?: string };
  formError?: string;
};

export const INITIAL_LOGIN_STATE: LoginState = { status: "idle", email: "", remember: false };
