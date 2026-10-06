import { SearchX } from "lucide-react";
import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/** Fallback for URLs that do not match any screen. */
export default function NotFound() {
  return (
    <MobileShell>
      <main className="flex flex-1 flex-col justify-center px-6">
        <EmptyState
          titleAs="h1"
          icon={<SearchX className="size-6" />}
          title="No encontramos esta página"
          description="Puede que el enlace esté roto o que la página ya no exista."
          action={
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Ir al inicio
            </Link>
          }
        />
      </main>
    </MobileShell>
  );
}
