import { randomUUID } from "node:crypto";
import { findProduct } from "./catalog.js";
import { computeDiscount, findDiscount } from "./discounts.js";

const TAX_RATE = 0.08;
const SHIPPING_CENTS = 599;
const FREE_SHIPPING_OVER_CENTS = 5000;

export class CartError extends Error {}

const carts = new Map();

export function createCart() {
  const cart = { id: randomUUID(), items: {}, discount: null };
  carts.set(cart.id, cart);
  return cart;
}

export function getCart(id) {
  return carts.get(id);
}

export function setQuantity(cart, productId, quantity) {
  if (!findProduct(productId)) throw new CartError("Unknown product");
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20) {
    throw new CartError("Quantity must be a whole number from 0 to 20");
  }
  if (quantity === 0) delete cart.items[productId];
  else cart.items[productId] = quantity;
}

export function applyCode(cart, rawCode) {
  const code = String(rawCode ?? "")
    .trim()
    .toUpperCase();
  const rule = findDiscount(code);
  if (!rule) throw new CartError("That code is not valid");

  // Work the discount out once here so totals() stays cheap.
  cart.discount = {
    code,
    amountCents: computeDiscount(rule, subtotalOf(cart)),
    freeShipping: rule.type === "shipping",
  };
}

export function removeCode(cart) {
  cart.discount = null;
}

function subtotalOf(cart) {
  return Object.entries(cart.items).reduce(
    (sum, [productId, quantity]) => sum + findProduct(productId).priceCents * quantity,
    0,
  );
}

export function totals(cart) {
  const subtotalCents = subtotalOf(cart);
  const discountCents = cart.discount ? Math.min(cart.discount.amountCents, subtotalCents) : 0;
  const freeShipping =
    subtotalCents === 0 ||
    subtotalCents > FREE_SHIPPING_OVER_CENTS ||
    Boolean(cart.discount?.freeShipping);
  const shippingCents = freeShipping ? 0 : SHIPPING_CENTS;
  const taxCents = Math.round((subtotalCents - discountCents) * TAX_RATE);

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents - discountCents + shippingCents + taxCents,
  };
}

export function describe(cart) {
  return {
    id: cart.id,
    code: cart.discount?.code ?? null,
    items: Object.entries(cart.items).map(([productId, quantity]) => {
      const product = findProduct(productId);
      return { productId, name: product.name, priceCents: product.priceCents, quantity };
    }),
    totals: totals(cart),
  };
}
