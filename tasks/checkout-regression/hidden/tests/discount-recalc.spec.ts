import { expect, test } from "@playwright/test";
import { addToCart, applyCode, openShop, readMoney, setQuantity } from "./helpers";

// Hidden tests used for scoring. They never reach the candidate.

test("percent discount follows the cart when the quantity goes up", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "backpack"); // $45.00
  await applyCode(page, "SAVE10");
  await setQuantity(page, "backpack", 3); // $135.00

  expect(await readMoney(page, "subtotal")).toBe(13500);
  expect(await readMoney(page, "discount")).toBe(-1350);
});

test("percent discount follows the cart when an item is removed", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "backpack");
  await addToCart(page, "socks"); // $57.00
  await applyCode(page, "SAVE10");
  await page.getByTestId("remove-backpack").click(); // $12.00 left
  await expect(page.getByTestId("qty-backpack")).toHaveCount(0);

  expect(await readMoney(page, "subtotal")).toBe(1200);
  expect(await readMoney(page, "discount")).toBe(-120);
});

test("totals add up after the cart changes under a code", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "bottle");
  await applyCode(page, "SAVE10");
  await addToCart(page, "headlamp");

  const subtotal = await readMoney(page, "subtotal");
  const discount = await readMoney(page, "discount");
  const shipping = await readMoney(page, "shipping");
  const tax = await readMoney(page, "tax");
  expect(discount).toBe(-Math.round(subtotal * 0.1));
  expect(await readMoney(page, "total")).toBe(subtotal + discount + shipping + tax);
});

test("a fixed code keeps taking the same amount off", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "bottle");
  await applyCode(page, "WELCOME5");
  await addToCart(page, "bottle");

  expect(await readMoney(page, "discount")).toBe(-500);
});

test("free shipping code survives cart changes", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "socks");
  await applyCode(page, "FREESHIP");
  await addToCart(page, "bottle");

  expect(await readMoney(page, "shipping")).toBe(0);
});
