const money = (cents) => `$${(cents / 100).toFixed(2)}`;
const $ = (selector) => document.querySelector(selector);

let cartId = sessionStorage.getItem("cartId");

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers: { "content-type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

async function ensureCart() {
  if (cartId) {
    try {
      return await api(`/carts/${cartId}`);
    } catch {
      cartId = null;
    }
  }
  const cart = await api("/carts", { method: "POST" });
  cartId = cart.id;
  sessionStorage.setItem("cartId", cartId);
  return cart;
}

function render(cart) {
  const { totals } = cart;
  $("#empty").hidden = cart.items.length > 0;
  $("#cart-table").hidden = cart.items.length === 0;
  $("#cart-rows").innerHTML = cart.items
    .map(
      (item) => `<tr>
        <td>${item.name}</td>
        <td>${money(item.priceCents)}</td>
        <td><input type="number" min="0" max="20" value="${item.quantity}" data-testid="qty-${item.productId}" aria-label="Quantity of ${item.name}" /></td>
        <td><button type="button" data-testid="remove-${item.productId}">Remove</button></td>
      </tr>`,
    )
    .join("");
  for (const item of cart.items) {
    $(`[data-testid="qty-${item.productId}"]`).addEventListener("change", (event) =>
      changeQuantity(item.productId, Number(event.target.value)),
    );
    $(`[data-testid="remove-${item.productId}"]`).addEventListener("click", () =>
      changeQuantity(item.productId, 0),
    );
  }
  $("[data-testid=subtotal]").textContent = money(totals.subtotalCents);
  $("[data-testid=discount]").textContent = `-${money(totals.discountCents)}`;
  $("[data-testid=shipping]").textContent = money(totals.shippingCents);
  $("[data-testid=tax]").textContent = money(totals.taxCents);
  $("[data-testid=total]").textContent = money(totals.totalCents);
  $("#remove-code").hidden = !cart.code;
}

function showMessage(text, isError = false) {
  const el = $("#code-message");
  el.textContent = text;
  el.classList.toggle("error", isError);
}

async function changeQuantity(productId, quantity) {
  render(await api(`/carts/${cartId}/items`, { method: "PUT", body: { productId, quantity } }));
}

async function main() {
  const products = await api("/products");
  $("#products").innerHTML = products
    .map(
      (p) => `<li>
        <span>${p.name} <small>${money(p.priceCents)}</small></span>
        <button type="button" data-testid="add-${p.id}">Add to cart</button>
      </li>`,
    )
    .join("");

  render(await ensureCart());

  for (const p of products) {
    $(`[data-testid="add-${p.id}"]`).addEventListener("click", async () => {
      const current = (await api(`/carts/${cartId}`)).items.find((i) => i.productId === p.id);
      await changeQuantity(p.id, (current?.quantity ?? 0) + 1);
    });
  }

  $("#code-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const cart = await api(`/carts/${cartId}/discount`, {
        method: "POST",
        body: { code: $("#code-input").value },
      });
      render(cart);
      showMessage(`Code ${cart.code} applied`);
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  $("#remove-code").addEventListener("click", async () => {
    render(await api(`/carts/${cartId}/discount`, { method: "DELETE" }));
    showMessage("");
  });
}

main();
