/**
 * Email notifications via Resend (raw fetch, no SDK).
 * No-ops cleanly if RESEND_API_KEY is unset, so the rest of the system is
 * unaffected when email isn't configured.
 *
 * Env:
 *   RESEND_API_KEY   - Resend API key (required to send)
 *   GBP_EMAIL_FROM   - verified sender, e.g. "Sunrise GBP <gbp@roofwithsunrise.com>"
 *   GBP_NOTIFY_TO    - recipient (defaults to matt@pursuitanalytics.com)
 */
const RESEND_URL = 'https://api.resend.com/emails';

export function emailConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const from = process.env.GBP_EMAIL_FROM || 'Sunrise GBP <gbp@roofwithsunrise.com>';
  const recipient = to || process.env.GBP_NOTIFY_TO || 'matt@pursuitanalytics.com';
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: Array.isArray(recipient) ? recipient : [recipient], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Build the "new post ready to review" email for a generated draft. */
export function buildReviewEmail(post) {
  const base = process.env.APP_BASE_URL || 'https://roofwithsunrise.com';
  const link = `${base}/gbp-admin#post=${encodeURIComponent(post.id)}`;
  const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const urls = post.mediaUrls || [];
  const pair = urls.length >= 2;
  const imgs = urls
    .map((u) => `<img src="${u}" alt="" style="max-width:260px;border-radius:8px;margin:4px;border:1px solid #ddd">`)
    .join('');
  const copy = esc(post.finalCopy || post.draftCopy || '');
  const cta = post.ctaType && post.ctaType !== 'NONE' ? esc(post.ctaType) : 'none';
  const pairNote = pair
    ? `<p style="color:#5f6368;font-size:13px;margin:6px 0 0">These ${urls.length} photos will be stitched into one before / after image when you open the post.</p>`
    : '';

  const html = `<div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#202124">
    <h2 style="font-size:18px;margin:0 0 4px">New ${esc(post.type || 'job')} post ready to review</h2>
    <p style="color:#5f6368;margin:0 0 14px">Sunrise Roofing · Google Business Profile</p>
    <div style="text-align:center">${imgs}</div>
    ${pairNote}
    <div style="background:#f8f9fa;border:1px solid #e8eaed;border-radius:10px;padding:14px 16px;margin:16px 0">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#5f6368;margin-bottom:6px">Draft copy</div>
      <div style="font-size:15px;line-height:1.5;white-space:pre-wrap">${copy}</div>
      <div style="font-size:12px;color:#5f6368;margin-top:10px">Button: ${cta}</div>
    </div>
    <a href="${link}" style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">Open, edit &amp; publish →</a>
    <p style="color:#9aa0a6;font-size:12px;margin-top:18px">Opens the review page where you can tweak the text, publish now, or schedule it for later.</p>
  </div>`;

  return { subject: `New GBP post ready: ${post.type || 'job'} — review & publish`, html };
}
