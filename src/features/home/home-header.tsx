import { Search } from "lucide-react";
import { IconLink } from "@/components/ui/icon-button";
import { NotificationsButton } from "./notifications-button";

/** Greeting with quick access to movement search and notifications. */
export function HomeHeader({ displayName }: { displayName: string }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm text-body">Hola</span>
        <h1 className="text-xl font-semibold text-ink">{displayName}</h1>
      </div>
      <div className="flex items-center gap-1">
        <IconLink
          href="/movimientos?focus=search"
          label="Buscar movimientos"
          icon={<Search aria-hidden className="size-6" />}
        />
        <NotificationsButton />
      </div>
    </header>
  );
}
