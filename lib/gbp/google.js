/**
 * Google Business Profile API (OAuth 2.0 + localPosts). Raw fetch, no SDK.
 * Single-tenant: one refresh token stored in GBP_OAUTH_REFRESH_TOKEN env var.
 *
 * Scope: https://www.googleapis.com/auth/business.manage
 */
const SCOPE = 'https://www.googleapis.com/auth/business.manage';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS_API = 'https://mybusinessaccountmanagement.googleapis.com/v1';
const INFO_API = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const POSTS_API = 'https://mybusiness.googleapis.com/v4';

export function redirectUri() {
  const base = process.env.APP_BASE_URL || 'https://roofwithsunrise.com';
  return `${base}/api/gbp-oauth-callback`;
}

export function buildConsentUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode(code) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function accessTokenFromRefresh() {
  const refresh = process.env.GBP_OAUTH_REFRESH_TOKEN;
  if (!refresh) throw new Error('GBP_OAUTH_REFRESH_TOKEN not set (run the one-time OAuth first)');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refresh,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

/** List accounts + their locations so we can grab account/location IDs once. */
export async function listAccountsAndLocations() {
  const token = await accessTokenFromRefresh();
  const h = { Authorization: `Bearer ${token}` };

  const accRes = await fetch(`${ACCOUNTS_API}/accounts`, { headers: h });
  if (!accRes.ok) throw new Error(`accounts.list ${accRes.status}: ${await accRes.text()}`);
  const accounts = (await accRes.json()).accounts || [];

  const out = [];
  for (const acc of accounts) {
    // businessinformation list — include 'name' to get each location's ID
    // ("locations/NNN"). Surface any error so it's visible, not swallowed.
    const readMask = 'name,title,storefrontAddress';
    const locRes = await fetch(
      `${INFO_API}/${acc.name}/locations?readMask=${encodeURIComponent(readMask)}&pageSize=100`,
      { headers: h },
    );
    let locations;
    if (locRes.ok) {
      locations = ((await locRes.json()).locations || []).map((l) => ({
        name: l.name || null,
        title: l.title || '(untitled)',
      }));
    } else {
      locations = [{ _error: `bi locations.list ${locRes.status}: ${(await locRes.text()).slice(0, 500)}` }];
    }
    out.push({ account: acc.name, accountName: acc.accountName, locations });
  }
  return out;
}

/** List the location's localPosts (current live content) so the site can
 * sync edits made directly on Google. Returns [{ name, summary }]. */
export async function listLocalPosts(accountId, locationId) {
  const token = await accessTokenFromRefresh();
  const acc = String(accountId).replace(/^accounts\//, '');
  const loc = String(locationId).replace(/^locations\//, '');
  const out = [];
  let pageToken = null;
  let guard = 0;
  do {
    const url =
      `${POSTS_API}/accounts/${acc}/locations/${loc}/localPosts?pageSize=100` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`localPosts.list ${res.status}: ${await res.text()}`);
    const data = await res.json();
    (data.localPosts || []).forEach((p) => out.push({ name: p.name, summary: p.summary || '' }));
    pageToken = data.nextPageToken || null;
  } while (pageToken && ++guard < 10);
  return out;
}

function buildCallToAction(ctaType, ctaUrl) {
  if (!ctaType || ctaType === 'NONE') return undefined;
  if (ctaType === 'CALL') return { actionType: 'CALL' };
  if (!ctaUrl) return undefined;
  return { actionType: ctaType, url: ctaUrl };
}

/**
 * Publish a localPost.
 * accountId/locationId are the short numeric IDs (we build the v4 path).
 * Media URLs must be publicly fetchable by Google at publish time.
 */
export async function publishLocalPost({ accountId, locationId, summary, mediaUrls, ctaType, ctaUrl }) {
  if (!accountId || !locationId) throw new Error('Missing GBP_ACCOUNT_ID / GBP_LOCATION_ID');
  const token = await accessTokenFromRefresh();

  const body = { languageCode: 'en-US', summary, topicType: 'STANDARD' };
  const cta = buildCallToAction(ctaType, ctaUrl);
  if (cta) body.callToAction = cta;
  // GBP local posts support exactly ONE photo. Always send just the first
  // URL (the caller passes the composite for before/after pairs).
  if (mediaUrls && mediaUrls.length) {
    body.media = [{ mediaFormat: 'PHOTO', sourceUrl: mediaUrls[0] }];
  }

  const acc = accountId.replace(/^accounts\//, '');
  const loc = locationId.replace(/^locations\//, '');
  const url = `${POSTS_API}/accounts/${acc}/locations/${loc}/localPosts`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GBP localPosts ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.name || null; // e.g. accounts/123/locations/456/localPosts/POSTID
}
