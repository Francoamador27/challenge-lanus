import { db } from "@/server/db";

/** Reports whether the app can reach its database; used by Docker and uptime checks. */
export async function GET(): Promise<Response> {
  const headers = { "cache-control": "no-store" };
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json({ status: "error" }, { status: 503, headers });
  }
}
