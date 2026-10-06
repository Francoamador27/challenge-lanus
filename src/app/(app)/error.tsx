"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

/** Error boundary for the signed-in area, with a retry action. */
export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      className="mt-8"
      title="No pudimos cargar tu información"
      description="Revisá tu conexión e intentá de nuevo."
      onRetry={() => retry()}
    />
  );
}
