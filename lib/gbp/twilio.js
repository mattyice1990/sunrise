/**
 * Twilio WhatsApp helpers (raw — no twilio SDK dependency).
 * - parseInbound: read the form-encoded webhook body.
 * - validateSignature: verify X-Twilio-Signature (HMAC-SHA1) so only Twilio can post.
 * - downloadMedia: fetch a Twilio-hosted media file (needs account Basic auth).
 */
import crypto from 'crypto';

/** Accepts Vercel's parsed urlencoded body (a plain object). */
export function parseInbound(b) {
  const numMedia = parseInt(b.NumMedia || '0', 10);
  const mediaUrls = [];
  const mediaTypes = [];
  for (let i = 0; i < numMedia; i++) {
    if (b[`MediaUrl${i}`]) mediaUrls.push(b[`MediaUrl${i}`]);
    if (b[`MediaContentType${i}`]) mediaTypes.push(b[`MediaContentType${i}`]);
  }
  return {
    from: b.From || '',
    body: b.Body || '',
    numMedia,
    mediaUrls,
    mediaTypes,
    waMessageId: b.MessageSid || '',
  };
}

/**
 * Twilio signature = Base64(HMAC-SHA1(authToken, url + sorted(param=value...))).
 * `params` is a plain object of the POST fields.
 */
export function validateSignature(signature, url, params) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return false;
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);
  const expected = crypto.createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function downloadMedia(url) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!res.ok) throw new Error(`Twilio media download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export function extFromMime(mime) {
  if (!mime) return 'jpg';
  const map = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  return map[mime.split(';')[0]] || 'jpg';
}

/**
 * Send a WhatsApp message via Twilio (raw REST, no SDK).
 * If TWILIO_DAILY_PROMPT_TEMPLATE_SID is set, sends that approved content
 * template (required for proactive/business-initiated messages). Otherwise
 * falls back to a freeform body (only delivers inside the 24h session window
 * or to a joined sandbox participant — fine for testing).
 */
export async function sendWhatsApp(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!sid || !token || !from) throw new Error('Twilio env not configured');

  const params = new URLSearchParams({ From: from, To: to });
  const templateSid = process.env.TWILIO_DAILY_PROMPT_TEMPLATE_SID;
  if (templateSid) {
    params.set('ContentSid', templateSid);
    params.set('ContentVariables', JSON.stringify({ 1: body }));
  } else {
    params.set('Body', body);
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) throw new Error(`Twilio send ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).sid;
}
