/**
 * POST /api/gbp-handoff   TEMPORARY: remove once FieldProof shows Google connected.
 *
 * One-time move of this site's Google Business Profile connection to FieldProof
 * (the multi-client successor to this tool). The values live in Vercel as
 * sensitive variables that cannot be read back, so FieldProof's staff-only
 * import asks this endpoint for them, server to server.
 *
 * Guards: POST only; a 64-character random bearer secret that exists only in
 * the two Vercel projects (FIELDPROOF_HANDOFF_SECRET); a hard expiry, after
 * which it answers 404 even if nobody removes it; never cached. Wrong or
 * missing credentials get the same 404 as a route that does not exist.
 */
import { timingSafeEqual } from 'node:crypto';

const EXPIRES_AT = Date.parse('2026-11-18T04:25:00Z');

function safeEqual(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const secret = process.env.FIELDPROOF_HANDOFF_SECRET || '';
  const auth = req.headers.authorization || '';
  const ok =
    req.method === 'POST' &&
    Date.now() < EXPIRES_AT &&
    secret.length >= 64 &&
    auth.startsWith('Bearer ') &&
    safeEqual(auth.slice(7), secret);
  if (!ok) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json({
    gbp: {
      refresh_token: process.env.GBP_OAUTH_REFRESH_TOKEN || null,
      account_id: process.env.GBP_ACCOUNT_ID || null,
      location_id: process.env.GBP_LOCATION_ID || null,
      // A refresh token only works with the OAuth client that issued it.
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || null,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || null,
    },
  });
}
