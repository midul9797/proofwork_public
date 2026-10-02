import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "./catalog.js";
import {
  CartError,
  applyCode,
  createCart,
  describe,
  getCart,
  removeCode,
  setQuantity,
} from "./cart.js";

const PUBLIC_DIR = join(fileURLToPath(new URL(".", import.meta.url)), "public");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

async function handleApi(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean); // ["api", ...]

  if (req.method === "GET" && parts[1] === "products") return send(res, 200, PRODUCTS);
  if (req.method === "POST" && parts[1] === "carts" && parts.length === 2) {
    return send(res, 201, describe(createCart()));
  }

  const cart = getCart(parts[2]);
  if (parts[1] !== "carts" || !cart) return send(res, 404, { error: "Cart not found" });

  try {
    if (req.method === "GET" && parts.length === 3) return send(res, 200, describe(cart));
    if (req.method === "PUT" && parts[3] === "items") {
      const { productId, quantity } = await readJson(req);
      setQuantity(cart, productId, quantity);
      return send(res, 200, describe(cart));
    }
    if (req.method === "POST" && parts[3] === "discount") {
      applyCode(cart, (await readJson(req)).code);
      return send(res, 200, describe(cart));
    }
    if (req.method === "DELETE" && parts[3] === "discount") {
      removeCode(cart);
      return send(res, 200, describe(cart));
    }
  } catch (error) {
    if (error instanceof CartError) return send(res, 400, { error: error.message });
    throw error;
  }
  return send(res, 404, { error: "Not found" });
}

async function handleStatic(res, url) {
  const relative =
    url.pathname === "/" ? "index.html" : normalize(url.pathname).replace(/^[\\/]+/, "");
  try {
    const body = await readFile(join(PUBLIC_DIR, relative));
    res.writeHead(200, { "content-type": TYPES[extname(relative)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(req, res, url);
    else await handleStatic(res, url);
  } catch (error) {
    console.error(error);
    send(res, 500, { error: "Something went wrong" });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Shop running on http://localhost:${port}`));
