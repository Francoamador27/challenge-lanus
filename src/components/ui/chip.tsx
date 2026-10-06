import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Toggle chip for quick filters; exposes its state with aria-pressed. */
export function Chip({
  pressed,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "h-9 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
        pressed
          ? "bg-granate-700 text-white"
          : "bg-surface text-chip shadow-card hover:bg-granate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
