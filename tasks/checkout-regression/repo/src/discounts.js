const DISCOUNTS = {
  SAVE10: { type: "percent", value: 10 },
  WELCOME5: { type: "fixed", valueCents: 500 },
  FREESHIP: { type: "shipping" },
};

export function findDiscount(code) {
  return DISCOUNTS[code];
}

// Money taken off the goods. Never more than the subtotal.
export function computeDiscount(rule, subtotalCents) {
  let amount = 0;
  if (rule.type === "percent") amount = Math.round((subtotalCents * rule.value) / 100);
  if (rule.type === "fixed") amount = rule.valueCents;
  return Math.min(amount, subtotalCents);
}
