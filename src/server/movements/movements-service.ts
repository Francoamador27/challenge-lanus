import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { decodeCursor, encodeCursor } from "@/server/movements/cursor";
import {
  MOVEMENT_SELECT,
  toDbMovementType,
  toMovementDTO,
} from "@/server/movements/movement-mapper";
import type { MovementDTO, MovementPage, MovementType } from "@/shared/movements";
import { normalizeSearchText } from "@/shared/search";
import { isUuid } from "@/shared/uuid";

/** Raised when a pagination cursor cannot be decoded. */
export class InvalidCursorError extends Error {
  constructor() {
    super("Invalid cursor");
    this.name = "InvalidCursorError";
  }
}

/** Escapes LIKE wildcards so user input matches literally (Prisma's `contains` passes them through). */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export type ListMovementsParams = {
  q?: string;
  type?: MovementType;
  cursor?: string;
  limit: number;
};

/** Lists a user's movements newest first, optionally filtered by search text and type, one page at a time. */
export async function listMovements(
  userId: string,
  params: ListMovementsParams,
): Promise<MovementPage> {
  const cursor = params.cursor === undefined ? null : decodeCursor(params.cursor);
  if (params.cursor !== undefined && !cursor) {
    throw new InvalidCursorError();
  }
  const search = params.q ? normalizeSearchText(params.q) : "";

  const where: Prisma.MovementWhereInput = {
    userId,
    ...(params.type ? { type: toDbMovementType(params.type) } : {}),
    ...(search ? { counterpartySearch: { contains: escapeLikePattern(search) } } : {}),
    ...(cursor
      ? {
          OR: [
            { occurredAt: { lt: cursor.occurredAt } },
            { occurredAt: cursor.occurredAt, id: { lt: cursor.id } },
          ],
        }
      : {}),
  };

  const rows = await db.movement.findMany({
    where,
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
    take: params.limit + 1,
    select: MOVEMENT_SELECT,
  });

  const hasMore = rows.length > params.limit;
  const page = hasMore ? rows.slice(0, params.limit) : rows;
  const last = page.at(-1);
  return {
    data: page.map(toMovementDTO),
    nextCursor: hasMore && last ? encodeCursor({ occurredAt: last.occurredAt, id: last.id }) : null,
  };
}

/** Returns one of the user's movements, or null when it does not exist or belongs to someone else. */
export async function getMovementById(userId: string, id: string): Promise<MovementDTO | null> {
  if (!isUuid(id)) {
    return null;
  }
  const row = await db.movement.findFirst({ where: { id, userId }, select: MOVEMENT_SELECT });
  return row ? toMovementDTO(row) : null;
}
