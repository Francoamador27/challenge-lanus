import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileShell } from "@/components/layout/mobile-shell";
import { requireUser } from "@/server/auth/current-user";

/** Authenticated area: requires a valid session and adds the bottom navigation. */
export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireUser();
  return (
    <MobileShell>
      <main className="flex flex-1 flex-col px-6 pt-12 pb-32">{children}</main>
      <BottomNav />
    </MobileShell>
  );
}
