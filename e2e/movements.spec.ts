import { expect, test, type Page } from "@playwright/test";
import { login } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await login(page);
});

test("home shows both cards and the five latest movements", async ({ page }) => {
  await expect(page.getByRole("region", { name: "Tus tarjetas" }).getByRole("article")).toHaveCount(
    2,
  );
  const latest = page.getByRole("region", { name: "Últimos movimientos" }).getByRole("listitem");
  await expect(latest).toHaveCount(5);
  await expect(latest.first()).toContainText("Adobe");
});

test("search, quick filters, empty state and detail", async ({ page }) => {
  await page.getByRole("link", { name: "Buscar movimientos" }).click();
  await expect(page).toHaveURL(/\/movimientos$/);
  const search = page.getByRole("searchbox", { name: "Buscar movimientos" });
  await expect(search).toBeFocused();
  const results = page.getByRole("main").getByRole("listitem");

  await search.fill("adobe");
  await expect(results).toHaveCount(2);

  await search.fill("jose");
  await expect(results).toHaveCount(1);
  await expect(results.first()).toContainText("José Suárez");

  await search.fill("juan");
  await page.getByRole("button", { name: "Recibido" }).click();
  await expect(results).toHaveCount(1);
  await expect(results.first()).toContainText("Juan Cabrero");
  await expect(page).toHaveURL(/\?q=juan&type=received$/);

  await search.fill("zzz");
  await expect(page.getByText("No encontramos movimientos para “zzz”")).toBeVisible();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");

  await results.first().getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1, name: "Adobe" })).toBeVisible();
  await expect(page.getByText("Mastercard •••• 1234")).toBeVisible();
  await expect(page.getByText("GB-000001")).toBeVisible();
  await page.getByRole("link", { name: "Volver a movimientos" }).click();
  await expect(page).toHaveURL(/\/movimientos/);
});

test.describe("navigation keeps the search and filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/movimientos");
    await page.getByRole("searchbox", { name: "Buscar movimientos" }).fill("juan");
    await page.getByRole("button", { name: "Recibido" }).click();
    await expect(page).toHaveURL(/\?q=juan&type=received$/);
    await page
      .getByRole("main")
      .getByRole("link", { name: /Juan Cabrero/ })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Juan Cabrero" })).toBeVisible();
  });

  async function expectFilteredList(page: Page) {
    await expect(page).toHaveURL(/\/movimientos\?q=juan&type=received$/);
    await expect(page.getByRole("searchbox", { name: "Buscar movimientos" })).toHaveValue("juan");
    await expect(page.getByRole("button", { name: "Recibido" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(1);
  }

  test("with the browser back button", async ({ page }) => {
    await page.goBack();
    await expectFilteredList(page);
  });

  test("with the detail's back arrow", async ({ page }) => {
    await page.getByRole("link", { name: "Volver a movimientos" }).click();
    await expectFilteredList(page);
  });

  test("and the bottom nav starts a fresh list", async ({ page }) => {
    await page.goBack();
    await expectFilteredList(page);
    await page.getByRole("navigation").getByRole("link", { name: "Movimientos" }).click();
    await expect(page).toHaveURL(/\/movimientos$/);
    await expect(page.getByRole("searchbox", { name: "Buscar movimientos" })).toHaveValue("");
    await expect(page.getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(20);
  });
});

test("infinite scroll loads every movement", async ({ page }) => {
  await page.goto("/movimientos");
  const results = page.getByRole("main").getByRole("listitem");
  await expect(results).toHaveCount(20);
  await results.last().scrollIntoViewIfNeeded();
  await expect(results).toHaveCount(36);
});

test("an unknown movement shows the not-found screen with a 404", async ({ page }) => {
  const response = await page.goto("/movimientos/00000000-0000-4000-8000-000000000000");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "No encontramos este movimiento" })).toBeVisible();
});
