import { expect, test } from "@playwright/test";
import { DEMO_USER, login } from "./helpers";

test("asks for the missing fields", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByText("Ingresá tu email")).toBeVisible();
  await expect(page.getByText("Ingresá tu contraseña")).toBeVisible();
});

test("rejects wrong credentials and keeps the email", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(DEMO_USER.email);
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Ingresar" }).click();
  // Next renders its own route announcer with role="alert", so match ours by its text.
  await expect(
    page.getByRole("alert").filter({ hasText: "Email o contraseña incorrectos" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue(DEMO_USER.email);
});

test("sends protected pages to login and back after signing in", async ({ page }) => {
  await page.goto("/movimientos?type=sent");
  await expect(page).toHaveURL(/\/login\?next=%2Fmovimientos%3Ftype%3Dsent$/);
  await login(page, { expectHome: false });
  await expect(page).toHaveURL(/\/movimientos\?type=sent$/);
  await expect(page.getByRole("button", { name: "Enviado" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("logging out revokes the session server-side", async ({ page, context }) => {
  await page.goto("/login");
  await login(page);
  const session = (await context.cookies()).find((cookie) => cookie.name === "granabank_session");
  expect(session).toBeDefined();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await context.addCookies([session!]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

test("a stale session cookie lands on login without a redirect loop", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([{ name: "granabank_session", value: "stale", url: baseURL! }]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "GranaBank" })).toBeVisible();
});

test("sends security headers", async ({ page }) => {
  const response = await page.goto("/login");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
});
