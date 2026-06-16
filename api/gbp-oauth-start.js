/**
 * GET /api/gbp-oauth-start?secret=GBP_OAUTH_STATE_SECRET
 * One-time: redirects you to Google consent for the business.manage scope.
 * Protected by a shared secret so randoms can't trigger the flow.
 */
import { buildConsentUrl } from '../lib/gbp/google.js';

export default async function handler(req, res) {
  const secret = req.query?.secret;
  const expected = process.env.GBP_OAUTH_STATE_SECRET;
  if (!expected || secret !== expected) return res.status(403).send('Forbidden');

  // state carries the secret so the callback can verify the round-trip.
  res.writeHead(302, { Location: buildConsentUrl(expected) });
  return res.end();
}
