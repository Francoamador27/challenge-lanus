import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MobileShell } from "@/components/layout/mobile-shell";
import { login } from "@/features/auth/actions";
import { LoginForm } from "@/features/auth/login-form";
import { getCurrentSession } from "@/server/auth/current-user";
import { getSafeRedirectPath } from "@/server/auth/redirect";

export const metadata: Metadata = { title: "Ingresar" };

/** Login screen; visitors who already have a valid session go straight to their destination. */
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const destination = getSafeRedirectPath(typeof next === "string" ? next : undefined);
  if (await getCurrentSession()) {
    redirect(destination);
  }

  return (
    <MobileShell>
      <main className="flex min-h-dvh flex-col px-6 pt-24 pb-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span aria-hidden className="size-16 rounded-2xl bg-granate-700" />
          <h1 className="text-[32px] leading-tight font-semibold text-granate-700">GranaBank</h1>
          <p className="text-sm text-muted">Con cada compra, sumás orgullo granate</p>
        </div>
        <div className="mt-16 flex flex-1 flex-col">
          <LoginForm action={login} next={destination === "/" ? undefined : destination} />
        </div>
      </main>
    </MobileShell>
  );
}
