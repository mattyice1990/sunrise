/**
 * Every Google review for the location via the Business Profile API v4
 * reviews endpoint (the Places API caps at 5 and no longer serves this
 * listing). Auth uses the existing business.manage OAuth refresh token.
 * Shared by /api/gbp-reviews and /api/reviews.
 */
import { accessTokenFromRefresh } from './google.js';
import { gbpTarget } from '../../config/gbp.js';

const REVIEWS_API = 'https://mybusiness.googleapis.com/v4';
const STAR = { STAR_RATING_UNSPECIFIED: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export async function fetchGbpReviews() {
  const { accountId, locationId } = gbpTarget();
  if (!accountId || !locationId) throw new Error('GBP account/location not set');
  const acc = String(accountId).replace(/^accounts\//, '');
  const loc = String(locationId).replace(/^locations\//, '');

  const token = await accessTokenFromRefresh();
  const headers = { Authorization: `Bearer ${token}` };

  const reviews = [];
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
      const err = new Error(`GBP reviews ${r.status}`);
      err.status = 502;
      err.detail = body.slice(0, 500);
      throw err;
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

  return {
    rating: averageRating,
    totalReviews: totalReviewCount || reviews.length,
    count: reviews.length,
    reviews,
  };
}
