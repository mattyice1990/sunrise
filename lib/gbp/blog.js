/**
 * Blog channel: turn a job submission (photos + note) into a long-form SEO
 * article via Claude. The article is then published through the existing
 * /api/blog-webhook pipeline (same template + commit + blog-posts.json update).
 */
import { GBP } from '../../config/gbp.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || ('roofing-' + Date.now().toString(36));
}

const CLAUDE_OK = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
async function imageBlock(url) {
  // Normalize raw phone photos (HEIC/oversized) to a small JPEG so Claude can read them.
  const proxied =
    'https://images.weserv.nl/?url=' + encodeURIComponent(url.replace(/^https?:\/\//, '')) + '&w=1280&output=jpg&q=82';
  try {
    const r = await fetch(proxied);
    if (!r.ok) throw new Error('proxy ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length) return { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: buf.toString('base64') } };
    throw new Error('empty');
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
  return JSON.parse(text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim());
}

// Resolve the configured YouTube channel (YT_CHANNEL_ID like "UC..." or YT_CHANNEL_HANDLE like "@sunriseroofers").
async function resolveChannelId(key) {
  const raw = process.env.YT_CHANNEL_ID || '';
  if (raw.startsWith('UC')) return raw;
  const handle = (process.env.YT_CHANNEL_HANDLE || raw || '').replace(/^@/, '');
  if (!handle) return null;
  const r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${key}`);
  if (!r.ok) return null;
  const d = await r.json();
  return d.items && d.items[0] ? d.items[0].id : null;
}

// Find the most relevant video on the client's OWN channel for a topic.
async function findChannelVideo(query) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  const channelId = await resolveChannelId(key);
  if (!channelId) return null;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}` +
    `&q=${encodeURIComponent(query)}&type=video&maxResults=1&order=relevance&key=${key}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const d = await r.json();
  return d.items && d.items[0] && d.items[0].id ? d.items[0].id.videoId : null;
}

// Insert a responsive 16:9 embed after the first paragraph (matches existing blog posts).
function embedVideo(html, videoId) {
  if (!videoId) return html;
  const iframe = '<div style="margin:26px 0"><iframe width="100%" style="aspect-ratio:16/9;border-radius:8px" ' +
    'src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" ' +
    'allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
  const i = html.indexOf('</p>');
  return i >= 0 ? html.slice(0, i + 4) + iframe + html.slice(i + 4) : html + iframe;
}

/**
 * @returns {Promise<{title,slug,metaDescription,contentHtml,tags}>}
 */
export async function generateBlogArticle(mediaUrls, note, opts = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable not set');

  const images = await Promise.all((mediaUrls || []).slice(0, 4).map(imageBlock));

  const servicePages = GBP.serviceMappings.map((m) => `- ${m.service}: ${m.page}`).join('\n');
  const areaPages = GBP.serviceAreas.map((a) => `- Roofing in ${a.city}: ${a.page}`).join('\n');

  const system = `You are an SEO content writer for ${GBP.businessName}, a ${GBP.businessType}.
Service area: ${GBP.serviceArea}. Brand voice: ${GBP.voiceTone}.
Target local keywords (use naturally, never stuff): ${GBP.targetKeywords.join(', ')}.
Hard rules: ${GBP.doNotPostRules}

The PURPOSE of this article is to ANSWER THE QUESTIONS a homeowner would actually search for or ask about this roof type / topic — search-intent, "People Also Ask" style. That is how blog content earns traffic.

From the photos + crew note, first identify the roof type and the work done. Then build the article around the most relevant real questions people ask about that topic — for example: how long it lasts in the Arizona climate, the signs it needs repair, repair vs. replacement, what affects the cost, maintenance tips, what the process/timeline looks like, common problems, or how to choose a contractor. Pick the 4-6 questions most relevant to THIS roof type/job. Reference the real job briefly for credibility, but the core value is genuinely and specifically answering those questions. Optimize for local SEO: work the city/area in naturally. 600-900 words, educational and trustworthy, never salesy.

HTML rules for the body:
- Phrase MOST <h2> headings as the actual questions people ask (e.g. "How long does a tile roof last in Tucson?", "What are the signs my tile roof needs repair?"), and answer each clearly and directly in the paragraph(s) beneath it.
- Semantic HTML only: <h2>, <h3>, <p>, <ul>/<li>, <strong>. No <h1> (the page adds the title). No <img> (the page adds the hero photo). No inline styles, no <script>.
- 4-6 question-style <h2> sections. End with a short, soft call-to-action paragraph.

INTERNAL LINKS (SEO): naturally weave 2-4 contextual links to the MOST relevant of these Sunrise pages into your sentences, using descriptive in-sentence anchor text (never a bare list of links). Also link "/contact" once for the call to action. Only link pages that genuinely fit the topic.
Service pages:
${servicePages}
Service-area pages:
${areaPages}

Return ONLY JSON (no prose, no code fences):
{
  "title": string (<=60 chars, include a local keyword, no quotes),
  "metaDescription": string (<=155 chars),
  "contentHtml": string (the article body as HTML, per the rules above),
  "tags": string[] (1-3 short topic tags; the first is the category)
}`;

  const userContent = [
    ...images,
    { type: 'text', text: `Crew note: ${note || '(none)'}\nCity/area: ${opts.city || 'Tucson'}\nService type: ${opts.serviceType || 'roofing'}\nAnalyze the ${images.length} photo(s) and write the article JSON.` },
  ];

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2500, system, messages: [{ role: 'user', content: userContent }] }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const block = (data.content || []).find((b) => b.type === 'text');
  if (!block) throw new Error('No text block in Claude response');
  const article = parseJson(block.text);
  article.slug = slugify(article.title);
  try {
    const vid = await findChannelVideo(`${opts.serviceType || 'roofing'} ${opts.city || 'Tucson'} ${article.title || ''}`);
    if (vid) article.contentHtml = embedVideo(article.contentHtml, vid);
  } catch (e) { /* no key/channel/video — skip the embed */ }
  return article;
}
