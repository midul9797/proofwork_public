# Checkout regression

You have joined the team behind **Northwind Outfitters**, a small online shop. Last week's release changed how discount codes are handled. Since then, support has been getting complaints about checkout totals.

You have **60 minutes**. You may use the AI assistant in the side panel as much or as little as you like. It is a normal coding assistant, and like any assistant it can be wrong, so check what it gives you.

## Running the project

- `npm start` runs the shop on port 3000.
- `npx playwright test` runs the test suite. It passes today.
- The code you will touch most lives in `src/`.

## Support tickets

> **Ticket #4821**: "I added a Trail Backpack ($45) and entered SAVE10. The discount was $4.50, which is right. Then I changed the quantity to 3, and the discount is still $4.50. It should be 10% of what I'm buying."

> **Ticket #4826**: "I had a backpack and a pair of socks, used SAVE10, then removed the backpack. The discount on my remaining $12 order is still much bigger than 10%. Please check my total."

> **Ticket #4830**: "I had $52 of items, applied SAVE10, and it came to $46.80. I still got free shipping. Is that right?" (Marketing's rule is below. Support is not sure.)

## What we need from you

1. Find out why the totals are wrong and fix it.
2. Add test(s) that fail without your fix and pass with it.
3. Keep the existing tests passing.
4. Tell us what you decided about ticket #4830, and why. If you are not sure what the rule means, say what you assumed.

## Acceptance criteria

- A discount code always reflects what is in the cart right now, whatever order the customer does things in.
- Subtotal, discount, shipping, tax and total always add up to each other.
- Your new tests would have caught the bug.
- You explain, in a short note at the end, what the cause was and what you changed.

## Business rules (from Marketing)

- `SAVE10` takes 10% off the goods.
- `WELCOME5` takes $5 off the goods.
- `FREESHIP` makes shipping free.
- One code per order. Applying a new code replaces the old one.
- Orders over $50 ship free; otherwise shipping is $5.99.
- Sales tax is 8%.
