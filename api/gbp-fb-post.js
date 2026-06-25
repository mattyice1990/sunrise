/**
 * POST /api/gbp-fb-post  (Bearer-protected, GBP_ACCESS_TOKEN)
 * Body: { id, finalCopy? }
 * Posts an existing submission's copy + photo(s) to the Facebook Page ONLY.
 * Deliberately does not touch the GBP/status fields — it just records
 * fbPostId/fbUrl — so you can push already-published (or any) content to
 * Facebook without re-posting to Google or disturbing the record.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { publishToFacebook } from '../lib/gbp/facebook.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id, finalCopy } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const posts = await readPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const message = (finalCopy ?? post.finalCopy ?? post.draftCopy ?? '').trim();
    // Prefer the stitched composite (before/after) when present; else the source photos.
    const mediaUrls = post.compositeUrl ? [post.compositeUrl] : post.mediaUrls || [];
    if (!message && !mediaUrls.length) return res.status(400).json({ error: 'Nothing to post (no copy or photos)' });

    let fb;
    try {
      fb = await publishToFacebook({ message, mediaUrls });
    } catch (e) {
      return res.status(502).json({ error: 'facebook: ' + e.message });
    }

    const updated = await withPosts((arr) => {
      const p = arr.find((x) => x.id === id);
      if (p) {
        p.fbPostId = fb.id;
        p.fbUrl = fb.url;
      }
      return p;
    }, `gbp: facebook post for ${id}`);

    return res.status(200).json({ url: fb.url, post: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
