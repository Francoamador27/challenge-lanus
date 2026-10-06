import { LogOut } from "lucide-react";
import { logout } from "./actions";

/** Bottom-navigation control that signs the user out. */
export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout} className="contents">
      <button type="submit" aria-label="Cerrar sesión" className={className}>
        <LogOut aria-hidden className="size-6" />
      </button>
    </form>
  );
}
