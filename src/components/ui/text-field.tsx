import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  trailing?: ReactNode;
};

/** Labelled input that links its error message for assistive technology. */
export function TextField({
  label,
  error,
  trailing,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-input bg-surface pl-4 shadow-card focus-within:ring-2 focus-within:ring-granate-700",
          trailing ? "pr-1" : "pr-4",
          error && "ring-1 ring-danger",
        )}
      >
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-full w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-subtle",
            className,
          )}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
