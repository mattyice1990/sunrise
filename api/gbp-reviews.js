/**
 * GET /api/gbp-reviews  (public)
 * Returns ALL Google reviews for the location (with owner responses) via the
 * Google Business Profile API v4 reviews endpoint — not the Places API, which
 * caps at 5. Auth uses the existing business.manage OAuth refresh token.
 */
import { fetchGbpReviews } from '../lib/gbp/reviews.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const data = await fetchGbpReviews();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({ ...data, status: 'success' });
  } catch (e) {
    if (e.status === 502) return res.status(502).json({ error: e.message, detail: e.detail });
    return res.status(500).json({ error: e.message });
  }
}
