import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centered phone-width column that frames every screen on wide viewports. */
export function MobileShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-page",
        className,
      )}
    >
      {children}
    </div>
  );
}
