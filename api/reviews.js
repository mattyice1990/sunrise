// Vercel Serverless Function to fetch Google Reviews.
// Keeps all keys server-side.
//
// Source: the Business Profile API (lib/gbp/reviews.js), returned in the
// Places-style shape older callers expect (time, relative_time_description).
// The Places API is only a secondary source: since 2026-10 it answers
// NOT_FOUND for this listing's Place ID even though the Maps feature ID
// (0x41069aff002a721d:0x27f42115ff29e8e8) is unchanged, and Find Place no
// longer returns the listing. GOOGLE_PLACE_ID in the Vercel env overrides the
// built-in ID if Google ever serves it again.
import { fetchGbpReviews } from '../lib/gbp/reviews.js';

export const config = { maxDuration: 30 };

const DEFAULT_PLACE_ID = 'ChIJHXIqAP-aBkER6Ogp_xUh9Cc';
const MAX_REVIEWS = 10;

function relativeTime(iso) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (isNaN(d)) return '';
  if (d < 1) return 'today';
  if (d < 7) return d === 1 ? 'a day ago' : `${d} days ago`;
  if (d < 30) { const w = Math.floor(d / 7); return w === 1 ? 'a week ago' : `${w} weeks ago`; }
  if (d < 365) { const m = Math.floor(d / 30); return m === 1 ? 'a month ago' : `${m} months ago`; }
  const y = Math.floor(d / 365); return y === 1 ? 'a year ago' : `${y} years ago`;
}

async function fromBusinessProfile() {
  const data = await fetchGbpReviews();
  const reviews = data.reviews
    .filter((rv) => rv.text)
    .sort((a, b) => (b.create_time || '').localeCompare(a.create_time || ''))
    .slice(0, MAX_REVIEWS)
    .map((rv) => ({
      author_name: rv.author_name,
      profile_photo_url: rv.profile_photo_url,
      rating: rv.rating,
      text: rv.text,
      time: rv.create_time ? Math.floor(new Date(rv.create_time).getTime() / 1000) : null,
      relative_time_description: rv.create_time ? relativeTime(rv.create_time) : '',
      create_time: rv.create_time,
    }));
  return { reviews, rating: data.rating, totalReviews: data.totalReviews, source: 'business_profile' };
}

async function fromPlaces(key) {
  const placeId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${key}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google API HTTP Error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    const err = new Error(data.error_message || `API returned status: ${data.status}`);
    err.googleStatus = data.status;
    throw err;
  }
  return {
    reviews: data.result?.reviews || [],
    rating: data.result?.rating || 5.0,
    totalReviews: data.result?.user_ratings_total || 0,
    source: 'places',
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let result = null;
  const errors = [];

  try {
    result = await fromBusinessProfile();
  } catch (e) {
    errors.push(`business_profile: ${e.message}`);
  }

  if (!result && process.env.GOOGLE_PLACES_API_KEY) {
    try {
      result = await fromPlaces(process.env.GOOGLE_PLACES_API_KEY);
    } catch (e) {
      errors.push(`places: ${e.googleStatus || ''} ${e.message}`.trim());
    }
  }

  if (!result) {
    console.error('Error fetching reviews:', errors);
    return res.status(502).json({ error: 'Reviews unavailable', sources: errors });
  }

  res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600');
  return res.status(200).json({ ...result, status: 'success' });
}
