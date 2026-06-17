/**
 * POST /api/gbp-blog  (Bearer-protected, GBP_ACCESS_TOKEN)
 * Body: { id }
 * Generates an SEO blog article from a job submission, then publishes it via
 * the existing /api/blog-webhook (reuses its template + commit + index update).
 */
import { validateBearer } from '../lib/gbp/auth.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { generateBlogArticle } from '../lib/gbp/blog.js';

export const config = { maxDuration: 60 };

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
    if (!(post.mediaUrls || []).length) return res.status(400).json({ error: 'No photos on this submission' });

    const article = await generateBlogArticle(post.mediaUrls, post.note, { city: post.city, serviceType: post.serviceType });

    const base = process.env.APP_BASE_URL || 'https://roofwithsunrise.com';
    const outrankToken = process.env.OUTRANK_ACCESS_TOKEN;
    if (!outrankToken) return res.status(500).json({ error: 'OUTRANK_ACCESS_TOKEN not set (blog pipeline auth)' });

    const heroImage = post.compositeUrl || post.publishedMedia || (post.mediaUrls || [])[0] || null;
    const payload = {
      event_type: 'publish_articles',
      timestamp: new Date().toISOString(),
      data: {
        articles: [
          {
            id: 'gbp-' + id,
            title: article.title,
            slug: article.slug,
            content_html: article.contentHtml,
            content_markdown: article.contentHtml,
            meta_description: article.metaDescription,
            image_url: heroImage,
            created_at: new Date().toISOString(),
            tags: article.tags && article.tags.length ? article.tags : ['Roofing'],
          },
        ],
      },
    };

    const r = await fetch(`${base}/api/blog-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${outrankToken}` },
      body: JSON.stringify(payload),
    });
    const out = await r.json().catch(() => ({}));
    const ok = r.ok && out.results && out.results[0] && out.results[0].success;
    if (!ok) return res.status(502).json({ error: 'Blog publish failed', detail: out });

    const url = `${base}/blog/${article.slug}`;
    const updated = await withPosts((arr) => {
      const p = arr.find((x) => x.id === id);
      if (p) { p.blogUrl = url; p.blogTitle = article.title; }
      return p;
    }, `gbp: blog published for ${id}`);

    return res.status(200).json({ url, title: article.title, post: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
