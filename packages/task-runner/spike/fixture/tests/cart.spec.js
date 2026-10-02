import { test, expect } from "@playwright/test";

const page_html = `
  <button id="add">Add</button><span id="count">0</span>
  <script>
    let n = 0;
    document.getElementById("add").onclick = () => {
      document.getElementById("count").textContent = ++n;
    };
  </script>`;

test("adds items to the cart", async ({ page }) => {
  await page.setContent(page_html);
  await page.click("#add");
  await page.click("#add");
  await expect(page.locator("#count")).toHaveText("2");
});

test("starts empty", async ({ page }) => {
  await page.setContent(page_html);
  await expect(page.locator("#count")).toHaveText("0");
});

test("deliberate failure to check exit codes", async ({ page }) => {
  await page.setContent(page_html);
  await expect(page.locator("#count")).toHaveText("1");
});
