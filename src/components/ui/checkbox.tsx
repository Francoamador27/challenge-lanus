import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Native checkbox styled like the design, with its label. */
export function Checkbox({
  label,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string }) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-subtle",
        className,
      )}
    >
      <input type="checkbox" className="size-4 rounded accent-granate-700" {...props} />
      {label}
    </label>
  );
}
