import type { MovementDTO } from "@/shared/movements";
import { MovementItem } from "./movement-item";

/** Vertical list of movement rows; `linkSearch` carries the list's filters into each detail link. */
export function MovementList({
  movements,
  linkSearch,
}: {
  movements: MovementDTO[];
  linkSearch?: string;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {movements.map((movement) => (
        <li key={movement.id}>
          <MovementItem movement={movement} linkSearch={linkSearch} />
        </li>
      ))}
    </ul>
  );
}
