// Vercel Serverless Function to fetch Google Reviews (Places API — max 5 reviews).
// Backup for /api/gbp-reviews. Keeps the API key server-side.
//
// Google retires Place IDs from time to time (Details then answers NOT_FOUND).
// When that happens we re-resolve the ID by the business phone number / name and
// keep using the fresh one for the life of the instance. GOOGLE_PLACE_ID in the
// Vercel env overrides the built-in ID.

const DEFAULT_PLACE_ID = 'ChIJHXIqAP-aBkER6Ogp_xUh9Cc';
// The Maps CID never changes, so it is the identity check for any re-resolved
// Place ID (there are other "Sunrise Roofing" companies in the index).
const MAPS_CID = '2878962440155556072';
const PHONES = ['+15207531758', '+15209753527'];
const NAME_QUERY = 'Sunrise Roofers LLC Tucson AZ';
const TUCSON_BIAS = 'circle:60000@32.2226,-110.9747';
const PLACES = 'https://maps.googleapis.com/maps/api/place';

let resolvedPlaceId = null;

async function placeDetails(placeId, key) {
  const url = `${PLACES}/details/json?place_id=${encodeURIComponent(placeId)}&fields=place_id,reviews,rating,user_ratings_total&key=${key}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google API HTTP Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

// Does this Place ID belong to our Maps listing? Details `url` is
// https://maps.google.com/?cid=<CID>.
async function isOurPlace(placeId, key) {
  const r = await fetch(`${PLACES}/details/json?place_id=${encodeURIComponent(placeId)}&fields=url&key=${key}`);
  if (!r.ok) return false;
  const d = await r.json();
  return new RegExp(`[?&]cid=${MAPS_CID}(&|$)`).test(d.result?.url || '');
}

// Find the current Place ID — phone numbers first, then name near Tucson. A
// candidate is only accepted if its Maps CID matches ours.
async function findPlaceId(key) {
  const queries = [
    ...PHONES.map((p) => `input=${encodeURIComponent(p)}&inputtype=phonenumber`),
    `input=${encodeURIComponent(NAME_QUERY)}&inputtype=textquery&locationbias=${encodeURIComponent(TUCSON_BIAS)}`,
  ];
  for (const q of queries) {
    const r = await fetch(`${PLACES}/findplacefromtext/json?${q}&fields=place_id&key=${key}`);
    if (!r.ok) continue;
    const d = await r.json();
    for (const c of d.candidates || []) {
      if (await isOurPlace(c.place_id, key)) return c.place_id;
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  // Debug: Check if API key exists (without exposing it)
  if (!API_KEY) {
    return res.status(500).json({
      error: 'API key not configured',
      message: 'GOOGLE_PLACES_API_KEY environment variable is not set in Vercel',
      debug: 'Check Vercel Dashboard > Settings > Environment Variables'
    });
  }

  try {
    let placeId = resolvedPlaceId || process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
    let data = await placeDetails(placeId, API_KEY);

    // Stale / retired Place ID — look the business up again and retry once.
    if (data.status === 'NOT_FOUND' || data.status === 'INVALID_REQUEST') {
      const fresh = await findPlaceId(API_KEY);
      if (fresh && fresh !== placeId) {
        placeId = fresh;
        data = await placeDetails(placeId, API_KEY);
        if (data.status === 'OK') {
          resolvedPlaceId = placeId;
          console.warn(`Place ID ${DEFAULT_PLACE_ID} is stale; resolved to ${placeId}. Set GOOGLE_PLACE_ID or update DEFAULT_PLACE_ID.`);
        }
      }
    } else if (data.result?.place_id && data.result.place_id !== placeId) {
      // Google hands back the current ID when an old one still resolves.
      resolvedPlaceId = data.result.place_id;
    }

    // Check for API errors
    if (data.status === 'REQUEST_DENIED') {
      return res.status(500).json({
        error: 'Google API Request Denied',
        message: 'The API key may not have Places API enabled',
        googleError: data.error_message || 'Enable Google Places API at https://console.cloud.google.com',
        status: data.status
      });
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({
        error: 'Google API Error',
        message: data.error_message || `API returned status: ${data.status}`,
        status: data.status
      });
    }

    // Return the reviews
    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({
      reviews: data.result?.reviews || [],
      rating: data.result?.rating || 5.0,
      totalReviews: data.result?.user_ratings_total || 0,
      placeId,
      status: 'success'
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message,
      type: error.name
    });
  }
}
