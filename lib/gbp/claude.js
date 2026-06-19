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

Return ONLY JSON (no prose, no code fences):
{
  "postType": "job" | "before_after" | "faq" | "promo" | "educational",
  "postCopy": string,
  "ctaType": "LEARN_MORE" | "CALL" | "BOOK" | "ORDER" | "SHOP" | "SIGN_UP" | "NONE",
  "ctaUrl": string | null,
  "city": string | null,
  "serviceType": string | null,
  "recommendedMediaIndexes": number[],
  "qualityFlags": { "needsResend": boolean, "reason": string | null }
}`;
}

const CLAUDE_OK = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

/**
 * Fetch an image URL -> base64 block for the vision call. Raw phone photos can
 * be HEIC or huge and fail with "Could not process image", so normalize through
 * an image resizer (weserv) to a small standard JPEG; fall back to the original.
 */
async function imageBlock(url) {
  const proxied =
    'https://images.weserv.nl/?url=' + encodeURIComponent(url.replace(/^https?:\/\//, '')) + '&w=1280&output=jpg&q=82';
  try {
    const r = await fetch(proxied);
    if (!r.ok) throw new Error('proxy ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length) return { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: buf.toString('base64') } };
    throw new Error('empty proxy result');
  } catch (e) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch media ${url}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    let mediaType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0];
    if (!CLAUDE_OK.has(mediaType)) mediaType = 'image/jpeg';
    return { type: 'image', source: { type: 'base64', media_type: mediaType, data: buf.toString('base64') } };
  }
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

  const images = await Promise.all((mediaUrls || []).slice(0, 8).map(imageBlock));
  const userContent = [
    ...images,
    { type: 'text', text: `Crew note: ${note || '(none)'}\nAnalyze the ${images.length} photo(s) and return the JSON.` },
  ];

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
