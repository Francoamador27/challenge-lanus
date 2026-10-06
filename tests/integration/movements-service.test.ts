import { beforeAll, describe, expect, it } from "vitest";
import { db } from "@/server/db";
import {
  getMovementById,
  InvalidCursorError,
  listMovements,
} from "@/server/movements/movements-service";
import { seedDatabase } from "../../prisma/seed-database";
import { createMovement, createUser } from "./helpers/factories";
import { resetDatabase } from "./helpers/reset-database";

let userId: string;
let otherUserId: string;
let otherMovementId: string;

beforeAll(async () => {
  await resetDatabase();
  ({ userId } = await seedDatabase(db, {
    email: "soygranate@clublanus.com",
    password: "GRANATE1@",
  }));
  const other = await createUser();
  otherUserId = other.id;
  otherMovementId = (await createMovement(other.id, { counterparty: "Adobe" })).id;
});

const names = (page: { data: { counterparty: string }[] }) =>
  page.data.map((movement) => movement.counterparty);

describe("listMovements", () => {
  it("pages through every movement newest first without gaps or duplicates", async () => {
    const first = await listMovements(userId, { limit: 20 });
    expect(first.data).toHaveLength(20);
    expect(first.nextCursor).not.toBeNull();
    const second = await listMovements(userId, {
      limit: 20,
      cursor: first.nextCursor ?? undefined,
    });
    expect(second.data).toHaveLength(16);
    expect(second.nextCursor).toBeNull();

    const all = [...first.data, ...second.data];
    expect(new Set(all.map((movement) => movement.id)).size).toBe(36);
    const timestamps = all.map((movement) => Date.parse(movement.occurredAt));
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
  });

  it("searches people and services ignoring case and accents", async () => {
    expect(names(await listMovements(userId, { limit: 20, q: "juan" }))).toEqual([
      "Juan Perez",
      "Juan Rodríguez",
      "Juan Cabrero",
    ]);
    expect(names(await listMovements(userId, { limit: 20, q: "JOSÉ" }))).toEqual(["José Suárez"]);
    expect(names(await listMovements(userId, { limit: 20, q: "lanus" }))).toHaveLength(2);
  });

  it("filters by type and combines the filter with the search", async () => {
    const received = await listMovements(userId, { limit: 50, type: "received" });
    expect(received.data).toHaveLength(10);
    expect(received.data.every((movement) => movement.type === "received")).toBe(true);
    expect(names(await listMovements(userId, { limit: 20, q: "juan", type: "received" }))).toEqual([
      "Juan Cabrero",
    ]);
  });

  it("treats LIKE wildcards in the search as literal characters", async () => {
    expect((await listMovements(userId, { limit: 20, q: "%" })).data).toHaveLength(0);
    expect((await listMovements(userId, { limit: 20, q: "_" })).data).toHaveLength(0);
  });

  it("returns an empty page when nothing matches", async () => {
    expect(await listMovements(userId, { limit: 20, q: "zzz" })).toEqual({
      data: [],
      nextCursor: null,
    });
  });

  it("never returns another user's movements", async () => {
    const page = await listMovements(userId, { limit: 50, q: "adobe" });
    expect(page.data.map((movement) => movement.id)).not.toContain(otherMovementId);
    expect((await listMovements(otherUserId, { limit: 50 })).data).toHaveLength(1);
  });

  it("rejects malformed cursors", async () => {
    await expect(listMovements(userId, { limit: 20, cursor: "garbage" })).rejects.toBeInstanceOf(
      InvalidCursorError,
    );
  });

  it("keeps movements with identical timestamps stable across pages", async () => {
    const user = await createUser();
    const sameInstant = new Date("2026-09-01T12:00:00.000Z");
    await Promise.all(
      ["A", "B", "C"].map((name) =>
        createMovement(user.id, { counterparty: name, occurredAt: sameInstant }),
      ),
    );
    const first = await listMovements(user.id, { limit: 2 });
    const second = await listMovements(user.id, {
      limit: 2,
      cursor: first.nextCursor ?? undefined,
    });
    expect([...names(first), ...names(second)].sort()).toEqual(["A", "B", "C"]);
    expect(second.nextCursor).toBeNull();
  });
});

describe("getMovementById", () => {
  it("returns the user's movement with its card", async () => {
    const [newest] = (await listMovements(userId, { limit: 1 })).data;
    const movement = await getMovementById(userId, newest?.id ?? "");
    expect(movement).toMatchObject({
      counterparty: "Adobe",
      type: "auto_debit",
      reference: "GB-000001",
      card: { brand: "mastercard", last4: "1234" },
    });
  });

  it("returns null for other users' movements, unknown ids and malformed ids", async () => {
    expect(await getMovementById(userId, otherMovementId)).toBeNull();
    expect(await getMovementById(userId, "00000000-0000-4000-8000-000000000000")).toBeNull();
    expect(await getMovementById(userId, "not-a-uuid")).toBeNull();
  });
});
