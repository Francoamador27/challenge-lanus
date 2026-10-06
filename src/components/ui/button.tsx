import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70";

const VARIANT_CLASS = {
  primary: "bg-granate-700 text-white hover:bg-granate-900",
  secondary: "bg-surface text-granate-700 shadow-card hover:bg-granate-100",
  ghost: "bg-transparent text-granate-700 hover:bg-granate-100",
} as const;

const SIZE_CLASS = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASS;
export type ButtonSize = keyof typeof SIZE_CLASS;
type VariantOptions = { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean };

/** Class names for anything styled as a button, including links. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: VariantOptions = {}): string {
  return cn(BASE_CLASS, VARIANT_CLASS[variant], SIZE_CLASS[size], fullWidth && "w-full");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantOptions & { loading?: boolean };

/** Design-system button; `loading` shows a spinner and disables it. */
export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
