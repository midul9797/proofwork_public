import { expect, type Page } from "@playwright/test";

export type ProductId = "backpack" | "bottle" | "socks" | "headlamp";

/** Reads a money value such as "-$4.50" from the page and returns it in cents. */
export async function readMoney(page: Page, testId: string): Promise<number> {
  const text = (await page.getByTestId(testId).textContent()) ?? "";
  const negative = text.includes("-");
  const cents = Math.round(Number(text.replace(/[^0-9.]/g, "")) * 100);
  return negative && cents !== 0 ? -cents : cents;
}

export async function openShop(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("empty-cart")).toBeVisible();
}

/** Adds one product, waiting until the cart shows the new quantity. */
export async function addToCart(page: Page, productId: ProductId, times = 1) {
  for (let i = 0; i < times; i++) {
    const qty = page.getByTestId(`qty-${productId}`);
    const before = (await qty.count()) ? Number(await qty.inputValue()) : 0;
    await page.getByTestId(`add-${productId}`).click();
    await expect(qty).toHaveValue(String(before + 1));
  }
}

export async function setQuantity(page: Page, productId: ProductId, quantity: number) {
  const qty = page.getByTestId(`qty-${productId}`);
  const response = page.waitForResponse((r) => r.url().includes("/items"));
  await qty.fill(String(quantity));
  await qty.blur();
  await response;
  await expect(page.getByTestId(`qty-${productId}`)).toHaveValue(String(quantity));
}

export async function applyCode(page: Page, code: string) {
  await page.getByTestId("code-input").fill(code);
  const response = page.waitForResponse((r) => r.url().includes("/discount"));
  await page.getByTestId("apply-code").click();
  await response;
}
