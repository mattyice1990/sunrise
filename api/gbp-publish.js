/**
 * POST /api/gbp-publish  (Bearer-protected)
 * Body: { id, finalCopy?, ctaType?, ctaUrl?, mediaUrls? }
 * Saves any edits, then publishes the post to Google Business Profile (localPosts).
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { publishLocalPost } from '../lib/gbp/google.js';
import { gbpTarget } from '../config/gbp.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const edits = req.body || {};
    const { id } = edits;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const posts = await readPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const finalCopy = (edits.finalCopy ?? post.finalCopy ?? post.draftCopy ?? '').trim();
    if (!finalCopy) return res.status(400).json({ error: 'No copy to publish' });

    const ctaType = edits.ctaType ?? post.ctaType ?? 'NONE';
    const ctaUrl = edits.ctaUrl ?? post.ctaUrl ?? null;
    const mediaUrls = edits.mediaUrls ?? post.mediaUrls ?? [];
    const { accountId, locationId } = gbpTarget();

    let gbpPostId = null;
    let error = null;
    let status = 'published';
    try {
      gbpPostId = await publishLocalPost({ accountId, locationId, summary: finalCopy, mediaUrls, ctaType, ctaUrl });
    } catch (e) {
      status = 'failed';
      error = e.message;
    }

    const updated = await withPosts((arr) => {
      const p = arr.find((x) => x.id === id);
      if (!p) return null;
      p.finalCopy = finalCopy;
      p.ctaType = ctaType;
      p.ctaUrl = ctaUrl;
      p.mediaUrls = mediaUrls;
      p.status = status;
      p.gbpPostId = gbpPostId;
      p.error = error;
      p.publishedAt = status === 'published' ? new Date().toISOString() : null;
      return p;
    }, `gbp: publish ${id} (${status})`);

    return res.status(status === 'published' ? 200 : 502).json({ post: updated, error });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
