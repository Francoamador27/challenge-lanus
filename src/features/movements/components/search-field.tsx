import { Search, X } from "lucide-react";
import type { Ref } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SEARCH_MAX_LENGTH } from "@/shared/movements";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  busy: boolean;
  inputRef?: Ref<HTMLInputElement>;
};

/** Search box for movements, with a clear button and a busy indicator. */
export function SearchField({ value, onChange, busy, inputRef }: SearchFieldProps) {
  return (
    <div
      role="search"
      className="flex h-12 items-center gap-3 rounded-input bg-surface pr-1 pl-4 shadow-card focus-within:ring-2 focus-within:ring-granate-700"
    >
      <Search aria-hidden className="size-5 shrink-0 text-subtle" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={SEARCH_MAX_LENGTH}
        placeholder="Ingresá un nombre o servicio"
        aria-label="Buscar movimientos"
        enterKeyHint="search"
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
      />
      {busy && <Spinner className="text-subtle" />}
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="grid size-11 shrink-0 place-items-center rounded-full text-subtle hover:text-ink"
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : (
        <span aria-hidden className="size-3" />
      )}
    </div>
  );
}
