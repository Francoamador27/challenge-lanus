"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { logout } from "./actions";

/** Bottom-navigation control that signs the user out after forgetting every cached query. */
export function LogoutButton({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  return (
    <form action={logout} onSubmit={() => queryClient.clear()} className="contents">
      <button type="submit" aria-label="Cerrar sesión" className={className}>
        <LogOut aria-hidden className="size-6" />
      </button>
    </form>
  );
}
