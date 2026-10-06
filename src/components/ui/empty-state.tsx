import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  titleAs?: "h1" | "h2" | "p";
  className?: string;
};

/** Friendly message for views without data, with an optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  titleAs: Title = "p",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card bg-surface px-6 py-10 text-center shadow-card",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-full bg-granate-100 text-granate-700"
        >
          {icon}
        </span>
      )}
      <Title className="text-base font-semibold text-ink">{title}</Title>
      {description && <p className="text-sm text-subtle">{description}</p>}
      {action}
    </div>
  );
}
