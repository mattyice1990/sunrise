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

/**
 * Authorize a cron invocation. Accepts (any of):
 *  - Vercel's auto-injected `Authorization: Bearer <CRON_SECRET>` (set CRON_SECRET in Vercel — recommended)
 *  - the `x-vercel-cron` header (sent on some cron invocations)
 *  - a `vercel-cron` User-Agent (Vercel's cron fetcher)
 *  - a manual `?secret=<GBP_OAUTH_STATE_SECRET>` for testing
 */
export function cronAuthorized(req) {
  if (req.query && req.query.secret && req.query.secret === process.env.GBP_OAUTH_STATE_SECRET) return true;
  const auth = req.headers.authorization || '';
  if (process.env.CRON_SECRET && auth === 'Bearer ' + process.env.CRON_SECRET) return true;
  if (req.headers['x-vercel-cron']) return true;
  if (/vercel-cron/i.test(req.headers['user-agent'] || '')) return true;
  return false;
}

/** Constant-time string comparison to avoid leaking the token via timing. */
function safeEqual(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
