/**
 * POST /api/gbp-composite  (Bearer-protected)
 * Body: { id, dataUrl }   dataUrl = "data:image/jpeg;base64,...."
 *
 * The admin page stitches a submission's before/after photos into a single
 * image client-side (canvas) and sends it here. We commit it to the repo
 * under gbp-media/{id}/composite.jpg (served publicly so Google can fetch it
 * at publish time) and record it as post.compositeUrl.
 *
 * GBP local posts allow exactly one photo, so the composite IS the post image.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { putMedia, withPosts } from '../lib/gbp/store.js';

export const config = { api: { bodyParser: { sizeLimit: '12mb' } }, maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id, dataUrl } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (!dataUrl || typeof dataUrl !== 'string') return res.status(400).json({ error: 'Missing dataUrl' });

    const m = /^data:image\/(jpeg|jpg|png);base64,(.+)$/i.exec(dataUrl.trim());
    if (!m) return res.status(400).json({ error: 'dataUrl must be a base64 JPEG or PNG' });
    const ext = m[1].toLowerCase() === 'png' ? 'png' : 'jpg';
    const buffer = Buffer.from(m[2], 'base64');
    if (!buffer.length) return res.status(400).json({ error: 'Empty image' });
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Composite exceeds 5 MB (GBP limit)' });
    }

    // Unique-ish name so a re-stitch (e.g. after a swap) busts caches/CDN.
    const stamp = Date.now().toString(36);
    const url = await putMedia(id, `composite-${stamp}`, buffer, ext, `gbp: composite for ${id}`);

    const updated = await withPosts((arr) => {
      const p = arr.find((x) => x.id === id);
      if (!p) return null;
      p.compositeUrl = url;
      p.updatedAt = new Date().toISOString();
      return p;
    }, `gbp: set compositeUrl for ${id}`);

    if (!updated) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json({ url, post: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
