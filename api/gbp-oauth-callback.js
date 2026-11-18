/**
 * GET /api/gbp-oauth-callback  (Google redirects here after consent)
 * Exchanges the code and shows the refresh token ONCE so you can paste it into
 * Vercel env as GBP_OAUTH_REFRESH_TOKEN. Single-tenant: we don't persist it here.
 */
import { exchangeCode } from '../lib/gbp/google.js';

// FieldProof (the multi-client successor to this tool) signs in through the
// same Google OAuth client, and Google only accepts this URL as the redirect.
// Its state is "<org uuid>.<base36 time>.<24-char signature>", optionally
// prefixed "cal:"; ours is GBP_OAUTH_STATE_SECRET. A request carrying a
// FieldProof-shaped state is passed on untouched to FieldProof's own callback,
// which verifies the signature and exchanges the code itself. Nothing here
// trusts the request, and the destination is fixed.
const FIELDPROOF_CALLBACK = 'https://fieldproof-chi.vercel.app/api/oauth/google/callback';
const FIELDPROOF_STATE = /^(cal:)?[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.[0-9a-z]{1,12}\.[A-Za-z0-9_-]{24}$/;

export default async function handler(req, res) {
  const { code, state, error } = req.query || {};
  const expected = process.env.GBP_OAUTH_STATE_SECRET;

  if (typeof state === 'string' && state !== expected && FIELDPROOF_STATE.test(state)) {
    const q = new URLSearchParams({ state });
    if (typeof code === 'string') q.set('code', code);
    if (typeof error === 'string') q.set('error', error);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.writeHead(302, { Location: `${FIELDPROOF_CALLBACK}?${q}` });
    return res.end();
  }

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
