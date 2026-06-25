/**
 * POST /api/gbp-upload  (key-protected via GBP_UPLOAD_KEY)
 * Body: { key, note, location: {lat,lng,source}|null, photos: [dataURL] }
 *
 * Backs the crew's mobile upload page (job-upload.html). Commits photos to
 * gbp-media/, reverse-geocodes the location to a real address, and creates a
 * "new" submission in data/gbp/posts.json — the SAME pipeline the WhatsApp
 * intake feeds, so drafting / GBP / Facebook all work downstream unchanged.
 *
 * `location.source` is 'photo' (read from the photo's EXIF = where it was TAKEN)
 * or 'live' (the phone's spot at upload time = only right if sent from the job).
 */
import { putMedia, withPosts } from '../lib/gbp/store.js';

export const config = { maxDuration: 60 };

function dataUrlToBuffer(d) {
  const m = /^data:(image\/[\w+]+);base64,(.+)$/s.exec(d || '');
  if (!m) return null;
  return { ext: m[1].split('/')[1].replace('jpeg', 'jpg'), buf: Buffer.from(m[2], 'base64') };
}

// Coords -> human address via Google Geocoding API (reuses your Maps/Places key).
async function reverseGeocode(lat, lng) {
  const key = process.env.GOOGLE_GEOCODING_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  if (!key || lat == null || lng == null) return null;
  try {
    const r = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`);
    const d = await r.json();
    if (d.status !== 'OK' || !d.results || !d.results.length) return null;
    const top = d.results[0];
    const comp = (type) => {
      const c = (top.address_components || []).find((x) => x.types.includes(type));
      return c ? c.long_name : null;
    };
    return {
      address: top.formatted_address || null,
      neighborhood: comp('neighborhood') || comp('sublocality') || null,
      city: comp('locality') || comp('postal_town') || null,
      state: comp('administrative_area_level_1') || null,
    };
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Fail closed: a key must be configured AND matched.
  const expected = process.env.GBP_UPLOAD_KEY;
  const body = req.body || {};
  if (!expected || body.key !== expected) return res.status(401).json({ error: 'Unauthorized' });

  const photos = Array.isArray(body.photos) ? body.photos.slice(0, 8) : [];
  if (!photos.length) return res.status(400).json({ error: 'No photos' });

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Commit each photo; collect public URLs.
  const mediaUrls = [];
  for (let i = 0; i < photos.length; i++) {
    const dec = dataUrlToBuffer(photos[i]);
    if (!dec) continue;
    try {
      const url = await putMedia(id, i, dec.buf, dec.ext, `gbp: upload media for ${id}`);
      mediaUrls.push(url);
    } catch (e) {
      console.error('upload media failed', e.message);
    }
  }
  if (!mediaUrls.length) return res.status(502).json({ error: 'Could not store photos' });

  // Resolve a human location from the coordinates.
  let geo = null;
  const loc = body.location;
  if (loc && isFinite(loc.lat) && isFinite(loc.lng)) {
    const rev = await reverseGeocode(loc.lat, loc.lng);
    const area = rev
      ? (rev.neighborhood ? `${rev.neighborhood}, ${rev.city || ''}`.replace(/, $/, '') : rev.city)
      : null;
    geo = {
      lat: loc.lat,
      lng: loc.lng,
      source: loc.source || 'unknown',
      address: (rev && rev.address) || null,
      city: (rev && rev.city) || null,
      neighborhood: (rev && rev.neighborhood) || null,
      area: area || `${Number(loc.lat).toFixed(4)}, ${Number(loc.lng).toFixed(4)}`,
      mapUrl: `https://www.google.com/maps?q=${loc.lat},${loc.lng}`,
    };
  }

  await withPosts((posts) => {
    posts.unshift({
      id,
      status: 'new', // new -> draft -> published | failed (same lifecycle as WhatsApp intake)
      source: 'upload',
      from: 'job-upload',
      note: body.note || '',
      mediaUrls,
      geo,
      city: (geo && geo.city) || null,
      type: null,
      draftCopy: null,
      finalCopy: null,
      ctaType: null,
      ctaUrl: null,
      gbpPostId: null,
      error: null,
      createdAt: new Date().toISOString(),
    });
    return id;
  }, `gbp: upload submission ${id}${geo ? ' @ ' + geo.area : ''}`);

  return res.status(200).json({ ok: true, id, area: geo ? geo.area : null, source: geo ? geo.source : null });
}
