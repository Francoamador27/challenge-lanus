import type { Route } from "next";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONE_CLASS = {
  plain: "text-ink-strong hover:bg-surface hover:text-granate-700",
  surface: "bg-surface text-ink-strong shadow-card hover:text-granate-700",
} as const;

type Tone = keyof typeof TONE_CLASS;
type IconControlProps = { label: string; icon: ReactNode; tone?: Tone; className?: string };

function iconControlClass(tone: Tone, className?: string): string {
  return cn(
    "grid size-11 shrink-0 place-items-center rounded-input transition-colors",
    TONE_CLASS[tone],
    className,
  );
}

/** Icon-only button; `label` becomes its accessible name. */
export function IconButton({
  label,
  icon,
  tone = "plain",
  className,
  type = "button",
  ...props
}: IconControlProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type={type} aria-label={label} className={iconControlClass(tone, className)} {...props}>
      {icon}
    </button>
  );
}

/** Icon-only link; `label` becomes its accessible name. */
export function IconLink({
  label,
  icon,
  tone = "plain",
  className,
  href,
}: IconControlProps & { href: Route }) {
  return (
    <Link href={href} aria-label={label} className={iconControlClass(tone, className)}>
      {icon}
    </Link>
  );
}
