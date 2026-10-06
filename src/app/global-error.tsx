"use client";

import "./globals.css";

/** Last-resort screen shown when the root layout itself fails. */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="es-AR">
      <body>
        <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center gap-4 bg-page px-6 text-center">
          <h1 className="text-xl font-semibold text-ink">Algo salió mal</h1>
          <p className="text-sm text-subtle">Tuvimos un problema inesperado. Probá de nuevo.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="h-11 rounded-button bg-granate-700 px-5 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
