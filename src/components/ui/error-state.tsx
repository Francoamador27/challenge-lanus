import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

/** Error message announced to assistive technology, with an optional retry action. */
export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-card bg-surface px-6 py-10 text-center shadow-card",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-full bg-danger-soft text-danger"
      >
        <TriangleAlert className="size-6" />
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-subtle">{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
