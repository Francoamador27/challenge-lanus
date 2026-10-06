import { expect, type Page } from "@playwright/test";

export const DEMO_USER = {
  email: process.env.SEED_USER_EMAIL ?? "soygranate@clublanus.com",
  password: process.env.SEED_USER_PASSWORD ?? "GRANATE1@",
};

/** Fills the login form; with `expectHome` it waits for the home greeting. */
export async function login(page: Page, { expectHome = true } = {}) {
  await page.getByLabel("Email").fill(DEMO_USER.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(DEMO_USER.password);
  await page.getByRole("button", { name: "Ingresar" }).click();
  if (expectHome) {
    await expect(page.getByRole("heading", { level: 1, name: "Granate" })).toBeVisible();
  }
}
