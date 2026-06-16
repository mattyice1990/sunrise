/**
 * Website "recent work" proof layer (single-tenant MVP).
 * Derives public proof items from PUBLISHED posts on the fly — no separate
 * store — by matching each post to a real Sunrise service page + an
 * approximate, privacy-safe city pin. Generalizes later to multi-tenant.
 */
import { GBP } from '../../config/gbp.js';

const norm = (s) => String(s || '').toLowerCase();
export const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Pick the best service page for a post. Prefer Claude's serviceType tag;
 * only scan the post copy when no serviceType is set (legacy posts), since
 * incidental words like "storm season" otherwise mis-tag the service. */
export function matchService(post) {
  if (post.serviceType) {
    const st = norm(post.serviceType);
    for (const m of GBP.serviceMappings) {
      if (norm(m.service) === st || st.includes(norm(m.service)) || m.keywords.some((k) => st.includes(k))) return m;
    }
    return { service: post.serviceType, page: GBP.defaultServicePage };
  }
  const hay = `${norm(post.note)} ${norm(post.finalCopy || post.draftCopy)}`;
  for (const m of GBP.serviceMappings) {
    if (m.keywords.some((k) => hay.includes(k))) return m;
  }
  return { service: 'Roofing', page: GBP.defaultServicePage };
}

/** Pick the best service area (explicit city or scan for a known city name). */
export function matchArea(post) {
  const hay = `${norm(post.city)} ${norm(post.note)} ${norm(post.finalCopy || post.draftCopy)}`;
  for (const a of GBP.serviceAreas) {
    if (hay.includes(norm(a.city))) return a;
  }
  return GBP.defaultArea;
}

// Deterministic PRNG seeded by a string, so a post's pin stays put.
function seededRand(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Approximate a pin: stable random offset within radiusMiles of (lat,lng). */
export function jitter(lat, lng, seed, radiusMiles) {
  const r = seededRand(String(seed));
  const angle = r() * 2 * Math.PI;
  const dist = Math.sqrt(r()) * radiusMiles; // uniform over the disc
  const dLat = (dist / 69) * Math.cos(angle);
  const dLng = (dist / (69 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: +(lat + dLat).toFixed(6), lng: +(lng + dLng).toFixed(6) };
}

/** Map one published post -> public proof item. */
export function deriveProofItem(post) {
  const svc = matchService(post);
  const area = matchArea(post);
  const pin = jitter(area.lat, area.lng, post.id, GBP.recentWork.jitterRadiusMiles);
  const image = post.compositeUrl || post.publishedMedia || (post.mediaUrls || [])[0] || null;
  return {
    id: post.id,
    title: `${svc.service} in ${area.city}, AZ`,
    service_type: svc.service,
    city: area.city,
    short_description: (post.finalCopy || post.draftCopy || '').trim(),
    image_url: image,
    service_page_url: svc.page,
    location_page_url: area.page,
    cta_text: GBP.recentWork.defaultCtaText,
    cta_url: GBP.recentWork.defaultCtaUrl,
    approximate_lat: pin.lat,
    approximate_lng: pin.lng,
    privacy_level: 'approximate',
    published_at: post.publishedAt || null,
  };
}

/** Build the filtered, sorted, capped list of proof items from all posts. */
export function proofItemsFromPosts(posts, { service, city, max } = {}) {
  let items = (posts || [])
    .filter((p) => p.status === 'published' && !p.proofHidden)
    .map(deriveProofItem);
  if (service) items = items.filter((i) => slug(i.service_type) === slug(service) || slug(i.service_page_url).includes(slug(service)));
  if (city) items = items.filter((i) => slug(i.city) === slug(city));
  items.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  if (max) items = items.slice(0, max);
  return items;
}
