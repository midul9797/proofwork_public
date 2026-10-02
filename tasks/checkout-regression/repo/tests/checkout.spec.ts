import { expect, test } from "@playwright/test";
import { addToCart, applyCode, openShop, readMoney } from "./helpers";

test("SAVE10 takes 10% off the subtotal", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "backpack"); // $45.00
  await applyCode(page, "SAVE10");

  await expect(page.getByTestId("code-message")).toHaveText("Code SAVE10 applied");
  expect(await readMoney(page, "discount")).toBe(-450);
  expect(await readMoney(page, "shipping")).toBe(599);
  expect(await readMoney(page, "tax")).toBe(324);
  expect(await readMoney(page, "total")).toBe(4973);
});

test("rejects a code that does not exist", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "socks");
  await applyCode(page, "NOPE");

  await expect(page.getByTestId("code-message")).toHaveText("That code is not valid");
  expect(await readMoney(page, "discount")).toBe(0);
});

test("charges shipping on small orders and not on big ones", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "socks"); // $12.00
  expect(await readMoney(page, "shipping")).toBe(599);

  await addToCart(page, "backpack"); // now $57.00
  expect(await readMoney(page, "shipping")).toBe(0);
});
