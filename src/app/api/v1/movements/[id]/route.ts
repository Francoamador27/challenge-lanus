import type { NextRequest } from "next/server";
import { getUserFromRequest } from "@/server/auth/current-user";
import { privateJsonResponse, problemResponse } from "@/server/http/responses";
import { getMovementById } from "@/server/movements/movements-service";

/** Returns one of the signed-in user's movements. */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getUserFromRequest(request);
  if (!user) {
    return problemResponse({ status: 401, title: "Unauthorized" });
  }

  const { id } = await context.params;
  try {
    const movement = await getMovementById(user.id, id);
    return movement
      ? privateJsonResponse(movement)
      : problemResponse({ status: 404, title: "Not Found", detail: "Movement not found" });
  } catch (error) {
    console.error("Failed to load movement", error);
    return problemResponse({ status: 500, title: "Internal Server Error" });
  }
}
