import type { NextRequest } from "next/server";
import { getUserFromRequest } from "@/server/auth/current-user";
import { privateJsonResponse, problemResponse, toProblemErrors } from "@/server/http/responses";
import { InvalidCursorError, listMovements } from "@/server/movements/movements-service";
import { listMovementsQuerySchema } from "@/shared/movements";

/** Lists the signed-in user's movements with search, type filter and cursor pagination. */
export async function GET(request: NextRequest): Promise<Response> {
  const user = await getUserFromRequest(request);
  if (!user) {
    return problemResponse({ status: 401, title: "Unauthorized" });
  }

  const query = listMovementsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success) {
    return problemResponse({
      status: 400,
      title: "Invalid query parameters",
      errors: toProblemErrors(query.error),
    });
  }

  try {
    return privateJsonResponse(await listMovements(user.id, query.data));
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return problemResponse({
        status: 400,
        title: "Invalid query parameters",
        errors: [{ path: "cursor", message: "Invalid cursor" }],
      });
    }
    console.error("Failed to list movements", error);
    return problemResponse({ status: 500, title: "Internal Server Error" });
  }
}
