import { setupServer } from "msw/node";

/** Shared MSW server for component tests that call the REST API. */
export const server = setupServer();
