"use client";

import { House, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/features/auth/logout-button";
import { cn } from "@/lib/cn";

const ITEM_CLASS = "grid size-14 place-items-center rounded-full transition-colors";

/** Fixed bottom navigation with the current section highlighted. */
export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Inicio", Icon: House, active: pathname === "/" },
    {
      href: "/movimientos",
      label: "Movimientos",
      Icon: ReceiptText,
      active: pathname.startsWith("/movimientos"),
    },
  ] as const;

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] rounded-t-nav bg-surface pb-[env(safe-area-inset-bottom)] shadow-nav"
    >
      <ul className="flex h-18 items-center justify-around">
        {items.map(({ href, label, Icon, active }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                ITEM_CLASS,
                active ? "text-granate-700" : "text-ink-strong hover:text-granate-700",
              )}
            >
              <Icon aria-hidden className="size-6" />
            </Link>
          </li>
        ))}
        <li>
          <LogoutButton className={cn(ITEM_CLASS, "text-ink-strong hover:text-granate-700")} />
        </li>
      </ul>
    </nav>
  );
}
