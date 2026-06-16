/**
 * POST /api/gbp-generate  (Bearer-protected)
 * Body: { id }
 * Runs Claude (vision + copy) on a submission and saves the draft.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { generateDraft } from '../lib/gbp/claude.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const posts = await readPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const draft = await generateDraft(post.mediaUrls, post.note);

    // Map recommended indexes back to media URLs (fall back to all).
    const chosen = (draft.recommendedMediaIndexes || [])
      .map((i) => post.mediaUrls[i])
      .filter(Boolean);
    const mediaUrls = chosen.length ? chosen : post.mediaUrls;

    const updated = await withPosts((arr) => {
      const p = arr.find((x) => x.id === id);
      if (!p) return null;
      p.type = draft.postType || 'job';
      p.draftCopy = draft.postCopy || '';
      p.finalCopy = draft.postCopy || '';
      p.ctaType = draft.ctaType || 'NONE';
      p.ctaUrl = draft.ctaUrl || null;
      p.city = draft.city || null;
      p.serviceType = draft.serviceType || null;
      p.mediaUrls = mediaUrls;
      p.qualityFlags = draft.qualityFlags || null;
      p.status = 'draft';
      return p;
    }, `gbp: draft generated for ${id}`);

    return res.status(200).json({ post: updated, qualityFlags: draft.qualityFlags });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
