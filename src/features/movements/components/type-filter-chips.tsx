import { Chip } from "@/components/ui/chip";
import { MOVEMENT_TYPES, type MovementType } from "@/shared/movements";
import { MOVEMENT_TYPE_COPY } from "../labels";

const FILTERS: { value: MovementType | undefined; label: string }[] = [
  { value: undefined, label: "Todos" },
  ...MOVEMENT_TYPES.map((type) => ({ value: type, label: MOVEMENT_TYPE_COPY[type].filter })),
];

type TypeFilterChipsProps = {
  value: MovementType | undefined;
  onChange: (value: MovementType | undefined) => void;
};

/** Quick filters by movement type; exactly one is active at a time. */
export function TypeFilterChips({ value, onChange }: TypeFilterChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por tipo"
      className="-mx-6 flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 py-1"
    >
      {FILTERS.map((filter) => (
        <Chip
          key={filter.label}
          pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Chip>
      ))}
    </div>
  );
}
