import { Bell } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

const POPOVER_ID = "notifications-popover";

/** Bell button that opens a native popover; there are no notifications to show yet. */
export function NotificationsButton() {
  return (
    <>
      <IconButton
        label="Notificaciones"
        icon={<Bell aria-hidden className="size-6" />}
        popoverTarget={POPOVER_ID}
      />
      <div
        id={POPOVER_ID}
        popover="auto"
        className="inset-x-6 top-24 m-0 mx-auto w-auto max-w-[382px] rounded-card bg-surface p-4 text-sm font-medium text-ink shadow-card"
      >
        No tenés notificaciones nuevas
      </div>
    </>
  );
}
