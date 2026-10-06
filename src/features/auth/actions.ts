"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate } from "@/server/auth/authenticate";
import { getSafeRedirectPath } from "@/server/auth/redirect";
import { createSession, invalidateSession, sessionCookieOptions } from "@/server/auth/session";
import { loginSchema, type LoginState } from "@/shared/auth";
import { SESSION_COOKIE } from "@/shared/session-cookie";

const INVALID_CREDENTIALS = "Email o contraseña incorrectos";
const UNEXPECTED_ERROR = "No pudimos iniciar sesión. Probá de nuevo en unos minutos.";

/** Whether the request arrived over HTTPS; Vercel sets the header and Next fills it in locally. */
async function isHttpsRequest(): Promise<boolean> {
  const forwardedProto = (await headers()).get("x-forwarded-proto");
  return forwardedProto?.split(",")[0]?.trim() === "https";
}

/** Signs the user in with email and password, then redirects to the requested page. */
export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const remember = formData.get("remember") === "on";
  const parsed = loginSchema.safeParse({
    email,
    password: String(formData.get("password") ?? ""),
    remember,
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      email,
      remember,
      fieldErrors: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] },
    };
  }

  let user: { id: string } | null;
  try {
    user = await authenticate(parsed.data.email, parsed.data.password);
  } catch (error) {
    console.error("Unexpected error while signing in", error);
    return { status: "error", email, remember, formError: UNEXPECTED_ERROR };
  }
  if (!user) {
    return { status: "error", email, remember, formError: INVALID_CREDENTIALS };
  }

  const { token, expiresAt } = await createSession(user.id, { remember: parsed.data.remember });
  (await cookies()).set(
    SESSION_COOKIE,
    token,
    sessionCookieOptions({
      expiresAt: parsed.data.remember ? expiresAt : null,
      secure: await isHttpsRequest(),
    }),
  );
  redirect(getSafeRedirectPath(String(formData.get("next") ?? "")));
}

/** Signs the user out, revoking the session on the server. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await invalidateSession(token);
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
