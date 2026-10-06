import { execFileSync } from "node:child_process";
import { TEST_DATABASE_URL } from "./test-database-url";

/** Applies every migration to the integration database once before the suite runs. */
export default function setup(): void {
  execFileSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
      DATABASE_URL_UNPOOLED: TEST_DATABASE_URL,
    },
  });
}
