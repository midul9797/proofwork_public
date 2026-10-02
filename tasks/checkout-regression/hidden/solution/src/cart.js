import { randomUUID } from "node:crypto";
import { findProduct } from "./catalog.js";
import { computeDiscount, findDiscount } from "./discounts.js";

const TAX_RATE = 0.08;
const SHIPPING_CENTS = 599;
const FREE_SHIPPING_OVER_CENTS = 5000;

export class CartError extends Error {}

const carts = new Map();

export function createCart() {
  const cart = { id: randomUUID(), items: {}, code: null };
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
  if (!findDiscount(code)) throw new CartError("That code is not valid");

  // Only remember which code is applied; totals() works the amount out from the current cart.
  cart.code = code;
}

export function removeCode(cart) {
  cart.code = null;
}

function subtotalOf(cart) {
  return Object.entries(cart.items).reduce(
    (sum, [productId, quantity]) => sum + findProduct(productId).priceCents * quantity,
    0,
  );
}

export function totals(cart) {
  const subtotalCents = subtotalOf(cart);
  const rule = cart.code ? findDiscount(cart.code) : null;
  const discountCents = rule ? computeDiscount(rule, subtotalCents) : 0;
  const freeShipping =
    subtotalCents === 0 || subtotalCents > FREE_SHIPPING_OVER_CENTS || rule?.type === "shipping";
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
    code: cart.code,
    items: Object.entries(cart.items).map(([productId, quantity]) => {
      const product = findProduct(productId);
      return { productId, name: product.name, priceCents: product.priceCents, quantity };
    }),
    totals: totals(cart),
  };
}
