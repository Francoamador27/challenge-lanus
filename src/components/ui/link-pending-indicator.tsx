"use client";

import { useLinkStatus } from "next/link";
import { cn } from "@/lib/cn";

/** Dims the enclosing link while its navigation is pending. Place it inside a relative `<Link>`. */
export function LinkPendingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] bg-surface/60 opacity-0 transition-opacity",
        pending && "animate-pulse opacity-100",
      )}
    />
  );
}
