import "server-only";
import type { z } from "zod";

export type ProblemFieldError = { path: string; message: string };

type ProblemInit = {
  status: number;
  title: string;
  detail?: string;
  errors?: ProblemFieldError[];
};

const NO_STORE = "private, no-store";

/** Builds an RFC 9457 `application/problem+json` response. */
export function problemResponse({ status, title, detail, errors }: ProblemInit): Response {
  return Response.json(
    {
      type: "about:blank",
      title,
      status,
      ...(detail ? { detail } : {}),
      ...(errors ? { errors } : {}),
    },
    { status, headers: { "content-type": "application/problem+json", "cache-control": NO_STORE } },
  );
}

/** Builds a JSON response for user-specific data that must not be cached. */
export function privateJsonResponse(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "cache-control": NO_STORE } });
}

/** Converts Zod issues into the `errors` extension member of a problem response. */
export function toProblemErrors(error: z.ZodError): ProblemFieldError[] {
  return error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
}
