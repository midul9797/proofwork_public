import { createHash, randomBytes } from "node:crypto";

/** A random, unguessable token for a candidate link: 256 bits, URL-safe. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Only the hash is stored, so a database leak does not leak working candidate links. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
