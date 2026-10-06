import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Placeholder block shown while content loads; the pulse stops under reduced motion. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn("animate-pulse rounded-input bg-line motion-reduce:animate-none", className)}
    />
  );
}
