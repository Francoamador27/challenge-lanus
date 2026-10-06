import { ChevronLeft } from "lucide-react";
import type { Route } from "next";
import { IconLink } from "@/components/ui/icon-button";

type ScreenHeaderProps = { title: string; backHref?: Route; backLabel?: string };

/** Screen title with an optional back link. */
export function ScreenHeader({ title, backHref, backLabel = "Volver" }: ScreenHeaderProps) {
  return (
    <header className="flex items-center gap-4">
      {backHref && (
        <IconLink
          href={backHref}
          label={backLabel}
          tone="surface"
          icon={<ChevronLeft aria-hidden className="size-5" />}
        />
      )}
      <p className="text-xl font-semibold text-ink">{title}</p>
    </header>
  );
}
