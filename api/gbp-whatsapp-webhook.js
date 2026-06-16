/**
 * Twilio WhatsApp inbound webhook for the GBP agent.
 * Flow: verify Twilio signature -> download photos -> commit them to the repo
 * (served publicly) -> append a "new" post record to data/gbp/posts.json -> 200.
 *
 * Claude runs later from the admin page (keeps this webhook fast for Twilio).
 */
import { parseInbound, validateSignature, downloadMedia, extFromMime } from '../lib/gbp/twilio.js';
import { putMedia, withPosts } from '../lib/gbp/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Vercel auto-parses the urlencoded Twilio body into req.body (an object).
  const params = req.body || {};

  // Verify the request really came from Twilio.
  const signature = req.headers['x-twilio-signature'] || '';
  const base = process.env.APP_BASE_URL || 'https://roofwithsunrise.com';
  const url = `${base}/api/gbp-whatsapp-webhook`;
  if (process.env.TWILIO_AUTH_TOKEN && !validateSignature(signature, url, params)) {
    return res.status(403).json({ error: 'Invalid Twilio signature' });
  }

  const msg = parseInbound(params);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Commit each photo to the repo; collect public URLs.
  const mediaUrls = [];
  for (let i = 0; i < msg.mediaUrls.length; i++) {
    try {
      const buf = await downloadMedia(msg.mediaUrls[i]);
      const ext = extFromMime(msg.mediaTypes[i]);
      const publicUrl = await putMedia(id, i, buf, ext, `gbp: media for ${id}`);
      mediaUrls.push(publicUrl);
    } catch (e) {
      console.error('media store failed', e);
    }
  }

  await withPosts((posts) => {
    posts.unshift({
      id,
      status: 'new', // new -> draft -> published | failed
      from: msg.from,
      note: msg.body,
      mediaUrls,
      type: null,
      draftCopy: null,
      finalCopy: null,
      ctaType: null,
      ctaUrl: null,
      gbpPostId: null,
      error: null,
      createdAt: new Date().toISOString(),
    });
  }, `gbp: new submission ${id}`);

  // Empty TwiML — acknowledge without auto-replying.
  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send('<Response></Response>');
}
