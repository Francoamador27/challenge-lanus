import type { MovementDTO } from "@/shared/movements";
import { MovementItem } from "./movement-item";

/** Vertical list of movement rows. */
export function MovementList({ movements }: { movements: MovementDTO[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {movements.map((movement) => (
        <li key={movement.id}>
          <MovementItem movement={movement} />
        </li>
      ))}
    </ul>
  );
}
