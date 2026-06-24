/**
 * POST /api/gbp-create  (Bearer-protected)
 * Body: { mediaUrls: string[], note?: string }
 * Creates a brand-new "new" submission from photos hand-picked in the library
 * (the photos can come from different days / different original messages).
 * It then flows through the normal Generate -> composite -> publish pipeline.
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
    const { mediaUrls, note } = req.body || {};
    const urls = (Array.isArray(mediaUrls) ? mediaUrls : []).filter(ownMedia).slice(0, 4);
    if (!urls.length) return res.status(400).json({ error: 'Pick at least one photo from the library' });

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const post = {
      id,
      status: 'new',
      from: 'library',
      note: (note || '').toString().slice(0, 1500),
      mediaUrls: urls,
      type: null,
      draftCopy: null,
      finalCopy: null,
      ctaType: null,
      ctaUrl: null,
      gbpPostId: null,
      error: null,
      createdAt: now,
      updatedAt: now,
      fromLibrary: true,
    };

    await withPosts((posts) => {
      posts.unshift(post);
      return post;
    }, `gbp: new post from library (${urls.length} photo${urls.length === 1 ? '' : 's'})`);

    return res.status(200).json({ post });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
