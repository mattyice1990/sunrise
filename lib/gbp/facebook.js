/**
 * Facebook channel — publish a post to the Sunrise Facebook Page via the Meta
 * Graph API. Mirrors lib/gbp/google.js (publishLocalPost): env-driven, throws on
 * API error with the response message, returns the new post's id + permalink.
 *
 * Auth: FB_PAGE_ACCESS_TOKEN must be a PAGE access token with pages_manage_posts.
 * Use a Business "System User" token so it never expires (see PROJECT-OVERVIEW /
 * the Facebook setup notes). FB_PAGE_ID is the numeric Page id.
 *
 * Image URLs must be publicly fetchable by Facebook at publish time — ours are
 * served from roofwithsunrise.com/gbp-media/... so that's fine.
 *
 * Nothing here runs unless a post opts into the `facebook` channel AND the env
 * vars are set, so it stays dormant until you flip it on with a real token.
 */

const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v21.0';
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

/** True once a Page id + token are configured. */
export function facebookConfigured() {
  return Boolean(process.env.FB_PAGE_ID && process.env.FB_PAGE_ACCESS_TOKEN);
}

function fbConfig() {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) throw new Error('Missing FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN');
  return { pageId, token };
}

// POST to a Graph edge as form-encoded; throw the Graph error message on failure.
async function graphPost(path, params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    body.append(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
  const res = await fetch(`${GRAPH}/${path}`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json.error && json.error.message) || (await res.text().catch(() => '')) || `HTTP ${res.status}`;
    throw new Error(`Facebook ${path} ${res.status}: ${msg}`);
  }
  return json;
}

// Upload one photo UNPUBLISHED; returns its media fbid (for an album feed post).
async function uploadUnpublishedPhoto(pageId, token, imageUrl) {
  const json = await graphPost(`${pageId}/photos`, { url: imageUrl, published: 'false', access_token: token });
  return json.id; // photo id doubles as the media_fbid
}

const permalink = (id) => (id ? `https://www.facebook.com/${id}` : null);

/**
 * Publish to the Page. Picks the right edge by how many photos there are:
 *   0 photos  -> text (and optional link) post on /feed
 *   1 photo   -> single photo post on /photos (caption = message)
 *   2+ photos -> upload each unpublished, then one /feed post with attached_media
 *
 * @param {{message?:string, mediaUrls?:string[], link?:string}} opts
 * @returns {Promise<{id:string, url:string|null}>}  the FB post id + permalink
 */
export async function publishToFacebook({ message, mediaUrls, link } = {}) {
  const { pageId, token } = fbConfig();
  const photos = (mediaUrls || []).filter(Boolean);

  if (photos.length === 0) {
    const json = await graphPost(`${pageId}/feed`, { message, link, access_token: token });
    return { id: json.id, url: permalink(json.id) };
  }

  if (photos.length === 1) {
    const json = await graphPost(`${pageId}/photos`, { url: photos[0], caption: message, access_token: token });
    const id = json.post_id || json.id; // post_id is the story; fall back to photo id
    return { id, url: permalink(id) };
  }

  // Album: upload up to 10 unpublished, then one feed post tying them together.
  const fbids = [];
  for (const u of photos.slice(0, 10)) {
    try {
      fbids.push(await uploadUnpublishedPhoto(pageId, token, u));
    } catch (e) {
      // Skip a photo Facebook won't fetch rather than fail the whole post.
      console.error('fb photo upload skipped:', e.message);
    }
  }
  if (fbids.length === 0) {
    // Every photo failed — still get the words out as a text post.
    const json = await graphPost(`${pageId}/feed`, { message, link, access_token: token });
    return { id: json.id, url: permalink(json.id) };
  }
  const attached_media = fbids.map((id) => ({ media_fbid: id }));
  const json = await graphPost(`${pageId}/feed`, { message, attached_media, access_token: token });
  return { id: json.id, url: permalink(json.id) };
}
