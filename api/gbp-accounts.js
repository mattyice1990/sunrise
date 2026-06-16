/**
 * GET /api/gbp-accounts  (Bearer-protected)
 * Lists your GBP accounts + locations so you can copy the IDs into Vercel env
 * (GBP_ACCOUNT_ID / GBP_LOCATION_ID). Requires GBP_OAUTH_REFRESH_TOKEN set.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { listAccountsAndLocations } from '../lib/gbp/google.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const data = await listAccountsAndLocations();
    return res.status(200).json({ accounts: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
