import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { TEST_DATABASE_URL } from "./tests/integration/test-database-url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: { name: "unit", environment: "node", include: ["src/**/*.test.ts"] },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["./tests/integration/global-setup.ts"],
          setupFiles: ["./tests/integration/setup.ts"],
          env: { DATABASE_URL: TEST_DATABASE_URL, NODE_ENV: "test" },
          fileParallelism: false,
          testTimeout: 20_000,
          hookTimeout: 30_000,
        },
      },
    ],
  },
});
