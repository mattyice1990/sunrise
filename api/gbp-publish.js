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
    // Prefer the stitched before/after composite when present; GBP takes one photo.
    const mediaUrls = edits.mediaUrls ?? (post.compositeUrl ? [post.compositeUrl] : post.mediaUrls) ?? [];
    const { accountId, locationId } = gbpTarget();

    // Scheduling: if a future time is given, save the post as "scheduled" and
    // let the gbp-run-scheduled cron publish it when due (GBP has no native
    // scheduling). A past/invalid time falls through to publish-now.
    const when = edits.scheduledFor ? new Date(edits.scheduledFor) : null;
    if (when && !isNaN(when.getTime()) && when.getTime() > Date.now() + 30000) {
      const scheduled = await withPosts((arr) => {
        const p = arr.find((x) => x.id === id);
        if (!p) return null;
        p.finalCopy = finalCopy;
        p.ctaType = ctaType;
        p.ctaUrl = ctaUrl;
        if (edits.mediaUrls) p.mediaUrls = edits.mediaUrls;
        p.status = 'scheduled';
        p.scheduledFor = when.toISOString();
        p.channels = edits.channels || { gbp: true };
        p.error = null;
        return p;
      }, `gbp: schedule ${id} for ${when.toISOString()}`);
      if (!scheduled) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json({ post: scheduled, scheduled: true });
    }

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
      // Keep source photos intact; the published image is tracked via compositeUrl/publishedMedia.
      if (edits.mediaUrls) p.mediaUrls = edits.mediaUrls;
      p.publishedMedia = mediaUrls[0] || null;
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
