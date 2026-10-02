// Prices are in cents.
export const PRODUCTS = [
  { id: "backpack", name: "Trail Backpack", priceCents: 4500 },
  { id: "bottle", name: "Water Bottle", priceCents: 1800 },
  { id: "socks", name: "Wool Socks", priceCents: 1200 },
  { id: "headlamp", name: "Headlamp", priceCents: 2900 },
];

export function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}
