/**
 * POST /api/gbp-set-media  (Bearer-protected)
 * Body: { id, mediaUrls: string[] }
 * Replaces the photos on an existing post (add / remove / reorder / swap out),
 * and clears the composite so it re-stitches in the new order on next load.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { withPosts } from '../lib/gbp/store.js';
import { GBP } from '../config/gbp.js';

const ownMedia = (u) =>
  typeof u === 'string' && u.startsWith(`${GBP.mediaBaseUrl}/${GBP.mediaDir}/`);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id, mediaUrls } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const urls = (Array.isArray(mediaUrls) ? mediaUrls : []).filter(ownMedia).slice(0, 4);
    if (!urls.length) return res.status(400).json({ error: 'Pick at least one photo' });

    const updated = await withPosts((posts) => {
      const p = posts.find((x) => x.id === id);
      if (!p) return null;
      p.mediaUrls = urls;
      p.compositeUrl = null; // force a fresh stitch in the new order
      p.updatedAt = new Date().toISOString();
      return p;
    }, `gbp: set photos for ${id} (${urls.length})`);

    if (!updated) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json({ post: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
