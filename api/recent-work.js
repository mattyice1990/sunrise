/**
 * Public "recent work" feed (no auth — it's public proof content).
 *   GET /api/recent-work                      -> JSON (default)
 *   GET /api/recent-work?format=html          -> crawlable HTML section
 *   ?service=tile-roof-repair  ?city=oro-valley  ?max=12   filters
 * Wired to /recent-work.json and /recent-work.html via vercel.json rewrites.
 *
 * Derives items from PUBLISHED posts on the fly. Privacy: approximate city
 * pins only, never addresses/names.
 */
import { readPosts } from '../lib/gbp/store.js';
import { proofItemsFromPosts } from '../lib/gbp/proof.js';
import { GBP } from '../config/gbp.js';

export const config = { maxDuration: 15 };

const esc = (s) =>
  String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function renderHtml(items) {
  const cards = items
    .map(
      (i) => `    <article class="lpe-card">
      ${i.image_url ? `<img class="lpe-img" src="${esc(i.image_url)}" alt="${esc(i.title)}" loading="lazy">` : ''}
      <div class="lpe-body">
        <h3 class="lpe-title">${esc(i.title)}</h3>
        <p class="lpe-desc">${esc(i.short_description)}</p>
        <p class="lpe-links"><a href="${esc(i.service_page_url)}">${esc(i.service_type)}</a>${
          i.location_page_url ? ` &middot; <a href="${esc(i.location_page_url)}">Roofing in ${esc(i.city)}</a>` : ''
        }</p>
        <a class="lpe-cta" href="${esc(i.cta_url)}">${esc(i.cta_text)} &rarr;</a>
      </div>
    </article>`,
    )
    .join('\n');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(GBP.recentWork.heading)} | ${esc(GBP.businessName)}</title>
<style>
  .lpe{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:1100px;margin:0 auto;padding:8px}
  .lpe h2{font-size:22px;margin:0 0 16px}
  .lpe-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
  .lpe-card{border:1px solid #e3e6ea;border-radius:12px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
  .lpe-img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#eef1f4}
  .lpe-body{padding:14px 16px;display:flex;flex-direction:column;gap:8px}
  .lpe-title{font-size:16px;margin:0;color:#1a2330}
  .lpe-desc{font-size:14px;line-height:1.5;color:#48515c;margin:0}
  .lpe-links{font-size:13px;margin:0}
  .lpe-links a{color:#1a73e8;text-decoration:none}
  .lpe-cta{margin-top:auto;display:inline-block;font-weight:600;color:#1a73e8;text-decoration:none;font-size:14px}
  .lpe-empty{color:#79828d;padding:24px 0}
</style></head>
<body><section class="lpe"><h2>${esc(GBP.recentWork.heading)}</h2>
<div class="lpe-grid">
${cards || '<p class="lpe-empty">Recent projects coming soon.</p>'}
</div></section></body></html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  let posts = [];
  try {
    posts = await readPosts();
  } catch (e) {
    return res.status(500).json({ error: `readPosts failed: ${e.message}` });
  }

  const q = req.query || {};
  const max = Math.min(parseInt(q.max, 10) || GBP.recentWork.maxItems, 100);
  const items = proofItemsFromPosts(posts, { service: q.service, city: q.city, max });

  if (q.format === 'html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(renderHtml(items));
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({
    business: GBP.businessName,
    heading: GBP.recentWork.heading,
    count: items.length,
    items,
  });
}
