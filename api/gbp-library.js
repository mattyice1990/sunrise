/**
 * GET /api/gbp-library  (Bearer-protected)
 * Lists every raw job photo committed under gbp-media/ (one entry per source
 * photo), newest first, so the admin page can show a pick-any photo library.
 * Excludes the stitched composite-*.jpg files (those are generated post images).
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { GBP } from '../config/gbp.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN environment variable not set');
    const { owner, repo, branch } = GBP.github;

    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
    );
    if (!r.ok) throw new Error(`GitHub tree ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const data = await r.json();

    const dir = String(GBP.mediaDir).replace(/\/$/, '');
    const esc = dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Raw source photos are named <index>.<ext> inside a per-submission folder.
    const rawRe = new RegExp('^' + esc + '/([^/]+)/(\\d+)\\.(jpe?g|png|webp|gif)$', 'i');

    const photos = [];
    for (const node of data.tree || []) {
      if (node.type !== 'blob') continue;
      const m = rawRe.exec(node.path);
      if (!m) continue;
      const folder = m[1];
      const tsm = /^(\d{10,})/.exec(folder);
      photos.push({ url: `${GBP.mediaBaseUrl}/${node.path}`, folder, ts: tsm ? parseInt(tsm[1], 10) : 0 });
    }
    photos.sort((a, b) => b.ts - a.ts || a.url.localeCompare(b.url));

    return res.status(200).json({ photos });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
