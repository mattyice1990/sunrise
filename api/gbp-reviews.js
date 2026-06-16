/**
 * GET /api/gbp-reviews  (public)
 * Returns ALL Google reviews for the location (with owner responses) via the
 * Google Business Profile API v4 reviews endpoint — not the Places API, which
 * caps at 5. Auth uses the existing business.manage OAuth refresh token.
 */
import { accessTokenFromRefresh } from '../lib/gbp/google.js';
import { gbpTarget } from '../config/gbp.js';

export const config = { maxDuration: 30 };

const REVIEWS_API = 'https://mybusiness.googleapis.com/v4';
const STAR = { STAR_RATING_UNSPECIFIED: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { accountId, locationId } = gbpTarget();
    if (!accountId || !locationId) return res.status(500).json({ error: 'GBP account/location not set' });
    const acc = String(accountId).replace(/^accounts\//, '');
    const loc = String(locationId).replace(/^locations\//, '');

    const token = await accessTokenFromRefresh();
    const headers = { Authorization: `Bearer ${token}` };

    let reviews = [];
    let pageToken = null;
    let averageRating = 5;
    let totalReviewCount = 0;
    let guard = 0;

    do {
      const url =
        `${REVIEWS_API}/accounts/${acc}/locations/${loc}/reviews?pageSize=50` +
        (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');
      const r = await fetch(url, { headers });
      if (!r.ok) {
        const body = await r.text();
        return res.status(502).json({ error: `GBP reviews ${r.status}`, detail: body.slice(0, 500) });
      }
      const data = await r.json();
      averageRating = data.averageRating || averageRating;
      totalReviewCount = data.totalReviewCount || totalReviewCount;
      (data.reviews || []).forEach((rv) => {
        reviews.push({
          id: rv.reviewId,
          author_name: rv.reviewer?.displayName || 'Google user',
          profile_photo_url: rv.reviewer?.profilePhotoUrl || null,
          rating: STAR[rv.starRating] || 0,
          text: rv.comment || '',
          create_time: rv.createTime || null,
          owner_reply: rv.reviewReply?.comment || null,
          owner_reply_time: rv.reviewReply?.updateTime || null,
        });
      });
      pageToken = data.nextPageToken || null;
    } while (pageToken && ++guard < 10);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({
      rating: averageRating,
      totalReviews: totalReviewCount || reviews.length,
      count: reviews.length,
      reviews,
      status: 'success',
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
