import { expect, test } from "@playwright/test";
import { addToCart, openShop, readMoney } from "./helpers";

test("adds products and shows the subtotal", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "backpack");
  await addToCart(page, "bottle");

  expect(await readMoney(page, "subtotal")).toBe(6300);
});

test("removes an item from the cart", async ({ page }) => {
  await openShop(page);
  await addToCart(page, "socks");
  await addToCart(page, "bottle");
  await page.getByTestId("remove-socks").click();

  await expect(page.getByTestId("qty-socks")).toHaveCount(0);
  expect(await readMoney(page, "subtotal")).toBe(1800);
});
