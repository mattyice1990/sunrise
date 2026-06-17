/**
 * POST /api/gbp-delete  (Bearer-protected, GBP_ACCESS_TOKEN)
 * Body: { id }
 * Removes a submission from data/gbp/posts.json (the review queue + the
 * website recent-work feed). Does NOT delete an already-published Google post
 * (that lives on Google) — this just clears it from the tool/site.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { withPosts } from '../lib/gbp/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });

    let removed = false;
    await withPosts((arr) => {
      const i = arr.findIndex((p) => p.id === id);
      if (i >= 0) { arr.splice(i, 1); removed = true; }
      return removed;
    }, `gbp: delete submission ${id}`);

    if (!removed) return res.status(404).json({ error: 'Submission not found' });
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
