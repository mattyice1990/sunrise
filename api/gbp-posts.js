/**
 * GET /api/gbp-posts  (Bearer-protected)
 * Returns the posts index for the admin page.
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { readPosts } from '../lib/gbp/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!validateBearer(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const posts = await readPosts();
    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
