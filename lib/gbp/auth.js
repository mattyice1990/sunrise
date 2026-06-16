/**
 * Bearer-token auth for protected GBP endpoints.
 * Same convention as api/blog-webhook.js (OUTRANK_ACCESS_TOKEN), but its own
 * token so the two systems are isolated.
 */
import { timingSafeEqual } from 'node:crypto';

export function validateBearer(req) {
  const TOKEN = process.env.GBP_ACCESS_TOKEN;
  if (!TOKEN) {
    console.error('GBP_ACCESS_TOKEN environment variable not set');
    return false;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  return safeEqual(authHeader.slice(7), TOKEN);
}

/** Constant-time string comparison to avoid leaking the token via timing. */
function safeEqual(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
