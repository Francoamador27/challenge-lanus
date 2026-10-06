/** Connection string of the throwaway Postgres used by integration tests. */
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? "postgresql://granabank:granabank@localhost:5443/granabank_test";
