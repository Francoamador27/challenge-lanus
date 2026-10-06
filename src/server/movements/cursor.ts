import "server-only";
import { isUuid } from "@/shared/uuid";

export type MovementCursor = { occurredAt: Date; id: string };

/** Encodes the position of the last returned movement as an opaque, URL-safe cursor. */
export function encodeCursor({ occurredAt, id }: MovementCursor): string {
  return Buffer.from(`${occurredAt.toISOString()}|${id}`, "utf8").toString("base64url");
}

/** Decodes a cursor produced by `encodeCursor`, returning null when it is malformed. */
export function decodeCursor(value: string): MovementCursor | null {
  const [iso, id, ...rest] = Buffer.from(value, "base64url").toString("utf8").split("|");
  if (!iso || !id || rest.length > 0 || !isUuid(id)) {
    return null;
  }
  const occurredAt = new Date(iso);
  if (Number.isNaN(occurredAt.getTime()) || occurredAt.toISOString() !== iso) {
    return null;
  }
  return { occurredAt, id };
}
