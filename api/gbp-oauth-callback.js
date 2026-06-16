/**
 * GET /api/gbp-oauth-callback  (Google redirects here after consent)
 * Exchanges the code and shows the refresh token ONCE so you can paste it into
 * Vercel env as GBP_OAUTH_REFRESH_TOKEN. Single-tenant: we don't persist it here.
 */
import { exchangeCode } from '../lib/gbp/google.js';

export default async function handler(req, res) {
  const { code, state, error } = req.query || {};
  const expected = process.env.GBP_OAUTH_STATE_SECRET;

  if (error) return res.status(400).send(`Consent denied: ${error}`);
  if (!expected || state !== expected) return res.status(403).send('Bad state');
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokens = await exchangeCode(code);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (!tokens.refresh_token) {
      return res.status(400).send(
        '<p>No refresh token returned. Revoke prior access at myaccount.google.com/permissions and retry.</p>',
      );
    }
    return res.status(200).send(`<!doctype html><meta charset="utf-8">
<body style="font-family:system-ui;max-width:680px;margin:40px auto;padding:0 16px">
<h2>Google connected ✅</h2>
<p>Copy this refresh token into Vercel → Settings → Environment Variables as
<code>GBP_OAUTH_REFRESH_TOKEN</code>, then redeploy. Do not share it.</p>
<textarea style="width:100%;height:120px;font-family:monospace">${tokens.refresh_token}</textarea>
<p>Next: open <code>/api/gbp-accounts</code> (with your Bearer token) to get your
account &amp; location IDs.</p>
</body>`);
  } catch (e) {
    return res.status(500).send(`Error: ${e.message}`);
  }
}
