/**
 * Claude vision + copywriting in one call (raw fetch — no SDK dependency).
 * Input: public image URLs + the client's note + Sunrise storyline.
 * Output: a structured GBP post draft.
 */
import { GBP } from '../../config/gbp.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

function systemPrompt() {
  return `You write Google Business Profile (GBP) local posts for ${GBP.businessName}, a ${GBP.businessType}.
Service area: ${GBP.serviceArea}.
Brand voice: ${GBP.voiceTone}.
Target local keywords (work in naturally, never keyword-stuff): ${GBP.targetKeywords.join(', ')}.
Preferred CTA: ${GBP.ctaPreference}.
Hard do-not-post rules: ${GBP.doNotPostRules}.

You are given 1+ job photos and a short note from the crew. Analyze the photos, then write the post.

Rules:
- Max ~1500 characters; aim for 2-4 short sentences.
- Mention the town/area when known (local SEO).
- One clear call to action.
- No emojis, no hashtags spam, no fabricated claims or prices.
- If photos are blurry, dark, or not roofing-related, set qualityFlags.needsResend = true.

Also identify, for the website "recent work" feed:
- "city": the town/area the job is in if stated or inferable (e.g. "Oro Valley", "Tucson", "Marana"), else null.
- "serviceType": a short label for the work shown (e.g. "Tile Roof Repair", "Roof Replacement", "Flat Roof Coating", "Roof Inspection"), else null.

BEFORE/AFTER ORDERING (important): when exactly TWO photos are provided and they look like a before/after pair, decide which photo is the BEFORE and which is the AFTER, then return "beforeAfterOrder" as the photo indexes in [beforeIndex, afterIndex] order. The BEFORE photo shows the old, worn, damaged, or in-progress/torn-off roof; the AFTER photo shows the new, finished, clean, completed roof. Use visual cues (old vs new materials, exposed decking vs finished surface, debris vs clean) and the crew note for direction. If you genuinely can't tell, or it is not a before/after pair, set "beforeAfterOrder" to null.

Return ONLY JSON (no prose, no code fences):
{
  "postType": "job" | "before_after" | "faq" | "promo" | "educational",
  "postCopy": string,
  "ctaType": "LEARN_MORE" | "CALL" | "BOOK" | "ORDER" | "SHOP" | "SIGN_UP" | "NONE",
  "ctaUrl": string | null,
  "city": string | null,
  "serviceType": string | null,
  "recommendedMediaIndexes": number[],
  "beforeAfterOrder": number[] | null,
  "qualityFlags": { "needsResend": boolean, "reason": string | null }
}`;
}

const CLAUDE_OK = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// Identify an image by its magic bytes (the .jpg extension and content-type lie
// for iPhone HEIC photos, which is exactly what breaks Claude's image decoder).
function sniffImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null; // HEIC/HEIF and anything else Claude can't decode
}

async function fetchBuf(u, ms = 15000) {
  const opts = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? { signal: AbortSignal.timeout(ms) } : {};
  const r = await fetch(u, opts);
  if (!r.ok) throw new Error('fetch ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

/**
 * Fetch an image URL -> base64 block Claude can read. Raw phone photos are often
 * HEIC or huge and fail with "Could not process image", so route through an image
 * resizer that re-encodes to a small JPEG. We VERIFY the resizer actually returned
 * a JPEG (don't blindly trust it), try a couple of variants, and only fall back to
 * the original if it's already a small Claude-decodable format. Returns null when a
 * photo can't be made usable — the caller drops it instead of failing the whole call.
 */
async function imageBlock(url) {
  const bare = encodeURIComponent(url.replace(/^https?:\/\//, ''));
  const resizers = [
    'https://wsrv.nl/?url=' + bare + '&w=1280&output=jpg&q=82&n=-1',
    'https://images.weserv.nl/?url=' + bare + '&w=1024&output=jpg&q=80',
  ];
  for (const v of resizers) {
    try {
      const buf = await fetchBuf(v);
      if (buf.length > 1000 && sniffImageType(buf) === 'image/jpeg') {
        return { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: buf.toString('base64') } };
      }
    } catch (e) { /* try the next resizer */ }
  }
  try {
    const buf = await fetchBuf(url);
    const t = sniffImageType(buf);
    if (t && buf.length < 4500000) {
      return { type: 'image', source: { type: 'base64', media_type: t, data: buf.toString('base64') } };
    }
  } catch (e) { /* unusable */ }
  return null;
}

function parseJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Generate a draft from media URLs + note.
 * @returns {Promise<{postType,postCopy,ctaType,ctaUrl,recommendedMediaIndexes,qualityFlags}>}
 */
export async function generateDraft(mediaUrls, note) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable not set');

  const images = (await Promise.all((mediaUrls || []).slice(0, 8).map(imageBlock))).filter(Boolean);
  const prompt = images.length
    ? `Crew note: ${note || '(none)'}\nAnalyze the ${images.length} photo(s) and return the JSON.`
    : `Crew note: ${note || '(none)'}\nNo usable photo could be processed (likely an iPhone HEIC). Write the post from the note alone, and set qualityFlags.needsResend=true with reason "photos couldn't be processed — please resend them as JPEG".`;
  const userContent = [...images, { type: 'text', text: prompt }];

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt(),
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const textBlock = (data.content || []).find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No text block in Claude response');
  return parseJson(textBlock.text);
}
