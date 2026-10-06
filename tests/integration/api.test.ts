import { beforeAll, describe, expect, it } from "vitest";
import { GET as health } from "@/app/api/health/route";
import { GET as getMovement } from "@/app/api/v1/movements/[id]/route";
import { GET as listMovementsRoute } from "@/app/api/v1/movements/route";
import { createSession } from "@/server/auth/session";
import { db } from "@/server/db";
import type { MovementDTO, MovementPage } from "@/shared/movements";
import { seedDatabase } from "../../prisma/seed-database";
import { createMovement, createUser } from "./helpers/factories";
import { apiRequest } from "./helpers/requests";
import { resetDatabase } from "./helpers/reset-database";

let token: string;
let foreignMovementId: string;

beforeAll(async () => {
  await resetDatabase();
  const { userId } = await seedDatabase(db, {
    email: "soygranate@clublanus.com",
    password: "GRANATE1@",
  });
  ({ token } = await createSession(userId, { remember: false }));
  const other = await createUser();
  foreignMovementId = (await createMovement(other.id)).id;
});

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("GET /api/v1/movements", () => {
  it("requires a session", async () => {
    const response = await listMovementsRoute(apiRequest("/api/v1/movements"));
    expect(response.status).toBe(401);
    expect(response.headers.get("content-type")).toBe("application/problem+json");
  });

  it("returns a page of the user's movements", async () => {
    const response = await listMovementsRoute(apiRequest("/api/v1/movements?limit=5", token));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    const body = (await response.json()) as MovementPage;
    expect(body.data).toHaveLength(5);
    expect(body.data[0]).toMatchObject({
      counterparty: "Adobe",
      type: "auto_debit",
      amount: { cents: 12_500, currency: "USD" },
    });
    expect(typeof body.nextCursor).toBe("string");
  });

  it("applies search, type and cursor parameters", async () => {
    const response = await listMovementsRoute(
      apiRequest("/api/v1/movements?q=juan&type=received", token),
    );
    const body = (await response.json()) as MovementPage;
    expect(body.data.map((movement) => movement.counterparty)).toEqual(["Juan Cabrero"]);
  });

  it.each([
    ["?type=refund", "type"],
    ["?limit=0", "limit"],
    [`?q=${"a".repeat(51)}`, "q"],
    ["?cursor=garbage", "cursor"],
  ])("rejects invalid query %s with a 400 problem naming %s", async (query, path) => {
    const response = await listMovementsRoute(apiRequest(`/api/v1/movements${query}`, token));
    expect(response.status).toBe(400);
    const body = (await response.json()) as { errors: { path: string }[] };
    expect(body.errors.map((error) => error.path)).toContain(path);
  });
});

describe("GET /api/v1/movements/{id}", () => {
  it("returns the user's movement", async () => {
    const list = (await (
      await listMovementsRoute(apiRequest("/api/v1/movements?limit=1", token))
    ).json()) as MovementPage;
    const id = list.data[0]?.id ?? "";
    const response = await getMovement(apiRequest(`/api/v1/movements/${id}`, token), params(id));
    expect(response.status).toBe(200);
    expect(((await response.json()) as MovementDTO).reference).toBe("GB-000001");
  });

  it.each([["foreign"], ["unknown"], ["malformed"]])("returns 404 for a %s id", async (kind) => {
    const ids: Record<string, string> = {
      foreign: foreignMovementId,
      unknown: "00000000-0000-4000-8000-000000000000",
      malformed: "abc",
    };
    const id = ids[kind] ?? "";
    const response = await getMovement(apiRequest(`/api/v1/movements/${id}`, token), params(id));
    expect(response.status).toBe(404);
  });

  it("requires a session", async () => {
    const response = await getMovement(
      apiRequest(`/api/v1/movements/${foreignMovementId}`),
      params(foreignMovementId),
    );
    expect(response.status).toBe(401);
  });
});

describe("GET /api/health", () => {
  it("reports ok when the database answers", async () => {
    const response = await health();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
