/**
 * Scheduled-publish cron. Runs frequently (see vercel.json crons).
 * Publishes any post with status "scheduled" whose scheduledFor time has
 * arrived. GBP has no native scheduling, so we hold the post and publish it
 * here when due. Auth: Vercel cron header or ?secret=GBP_OAUTH_STATE_SECRET.
 */
import { gbpTarget } from '../config/gbp.js';
import { cronAuthorized } from '../lib/gbp/auth.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { publishLocalPost, listLocalPosts } from '../lib/gbp/google.js';
import { generateDraft } from '../lib/gbp/claude.js';
import { generateBlogArticle } from '../lib/gbp/blog.js';
import { emailConfigured, sendEmail, buildReviewEmail } from '../lib/gbp/email.js';

const AUTO_PUBLISH = /^(1|true|yes|on)$/i.test(process.env.GBP_AUTO_PUBLISH || '');

// Generate + publish a blog article for a post (via the existing blog pipeline).
async function publishBlogFor(post) {
  const article = await generateBlogArticle(post.mediaUrls, post.note, { city: post.city, serviceType: post.serviceType });
  const base = process.env.APP_BASE_URL || 'https://roofwithsunrise.com';
  const token = process.env.OUTRANK_ACCESS_TOKEN;
  if (!token) throw new Error('OUTRANK_ACCESS_TOKEN not set');
  const hero = post.compositeUrl || post.publishedMedia || (post.mediaUrls || [])[0] || null;
  const r = await fetch(`${base}/api/blog-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      event_type: 'publish_articles', timestamp: new Date().toISOString(),
      data: { articles: [{ id: 'gbp-' + post.id, title: article.title, slug: article.slug, content_html: article.contentHtml, content_markdown: article.contentHtml, meta_description: article.metaDescription, image_url: hero, created_at: new Date().toISOString(), tags: article.tags && article.tags.length ? article.tags : ['Roofing'] }] } }),
  });
  const out = await r.json().catch(() => ({}));
  if (!(r.ok && out.results && out.results[0] && out.results[0].success)) throw new Error('blog publish failed');
  return `${base}/blog/${article.slug}`;
}

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (!cronAuthorized(req)) return res.status(403).json({ error: 'Forbidden' });

  let posts = [];
  try {
    posts = await readPosts();
  } catch (e) {
    return res.status(500).json({ error: `readPosts failed: ${e.message}` });
  }

  // ── Auto-draft + email (only when email is configured) ──────────────
  // Pass A: generate a draft for any "new" submission that has settled
  // (no new photos for 5 min, so before/after pairs are complete).
  if (emailConfigured()) {
    const SETTLE_MS = 5 * 60 * 1000;
    const fresh = posts.filter(
      (p) =>
        p.status === 'new' &&
        (p.mediaUrls || []).length > 0 &&
        Date.now() - new Date(p.updatedAt || p.createdAt).getTime() >= SETTLE_MS,
    );
    for (const post of fresh) {
      try {
        const draft = await generateDraft(post.mediaUrls, post.note);
        const chosen = (draft.recommendedMediaIndexes || []).map((i) => post.mediaUrls[i]).filter(Boolean);
        let mediaUrls = chosen.length ? chosen : post.mediaUrls;
        const src = post.mediaUrls || [];
        if (Array.isArray(draft.beforeAfterOrder) && draft.beforeAfterOrder.length === src.length) {
          const ordered = draft.beforeAfterOrder.map((i) => src[i]).filter(Boolean);
          if (ordered.length === src.length) mediaUrls = ordered;
        }
        const badPhotos = draft.qualityFlags && draft.qualityFlags.needsResend;

        // Full auto-publish: when enabled and photos are usable, publish now
        // (GBP takes one photo; pairs post the first image — no browser composite).
        let autoStatus = null, gbpPostId = null, perr = null;
        if (AUTO_PUBLISH && !badPhotos && (draft.postCopy || '').trim()) {
          const { accountId, locationId } = gbpTarget();
          try {
            gbpPostId = await publishLocalPost({
              accountId, locationId, summary: draft.postCopy,
              mediaUrls, ctaType: draft.ctaType || 'NONE', ctaUrl: draft.ctaUrl || null,
            });
            autoStatus = 'published';
          } catch (e) { autoStatus = 'failed'; perr = e.message; }
        }

        await withPosts((arr) => {
          const p = arr.find((x) => x.id === post.id);
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
          p.autoDrafted = true;
          if (autoStatus === 'published') {
            p.status = 'published'; p.gbpPostId = gbpPostId;
            p.publishedMedia = mediaUrls[0] || null; p.publishedAt = new Date().toISOString(); p.error = null;
          } else if (autoStatus === 'failed') {
            p.status = 'failed'; p.error = perr;
          } else {
            p.status = 'draft';
          }
          return p;
        }, `gbp: auto-${autoStatus || 'draft'} ${post.id}`);
      } catch (e) {
        console.error('auto-draft failed', post.id, e.message);
      }
    }

    // Pass B: email auto-handled posts we haven't notified about yet
    // (drafts awaiting approval, or a heads-up that one was auto-published).
    const after = await readPosts();
    const toNotify = after.filter(
      (p) => p.autoDrafted && !p.notifiedAt && (p.status === 'draft' || p.status === 'published'),
    );
    for (const post of toNotify) {
      try {
        const built = buildReviewEmail(post);
        const subject =
          post.status === 'published'
            ? `Auto-published to Google: ${post.type || 'job'} in ${post.city || 'Tucson'}`
            : built.subject;
        await sendEmail({ subject, html: built.html });
        await withPosts((arr) => {
          const p = arr.find((x) => x.id === post.id);
          if (p) p.notifiedAt = new Date().toISOString();
          return p;
        }, `gbp: notified ${post.id}`);
      } catch (e) {
        console.error('notify failed', post.id, e.message);
      }
    }
  }

  // Pass C: pull live post edits made directly on Google back into the site.
  // Only commits when something actually changed (avoids empty redeploys).
  try {
    const { accountId, locationId } = gbpTarget();
    if (accountId && locationId) {
      const live = await listLocalPosts(accountId, locationId);
      const byName = {};
      live.forEach((p) => { byName[p.name] = p.summary; });
      const current = await readPosts();
      const needs = current.some(
        (p) => p.gbpPostId && byName[p.gbpPostId] != null && p.finalCopy !== byName[p.gbpPostId],
      );
      if (needs) {
        await withPosts((arr) => {
          arr.forEach((p) => {
            if (p.gbpPostId && byName[p.gbpPostId] != null) p.finalCopy = byName[p.gbpPostId];
          });
          return true;
        }, 'gbp: sync live post copy from Google');
      }
    }
  } catch (e) {
    console.error('post sync failed', e.message);
  }

  const now = Date.now();
  const due = posts.filter(
    (p) => p.status === 'scheduled' && p.scheduledFor && new Date(p.scheduledFor).getTime() <= now,
  );
  if (!due.length) return res.status(200).json({ action: 'skip', due: 0 });

  const { accountId, locationId } = gbpTarget();
  const results = [];

  for (const post of due) {
    const ch = post.channels || { gbp: true };
    const summary = (post.finalCopy || post.draftCopy || '').trim();
    const mediaUrls = post.compositeUrl ? [post.compositeUrl] : post.mediaUrls || [];
    let gbpPostId = null;
    let error = null;
    let status = 'published';
    let blogUrl = post.blogUrl || null;

    // Channel: Google Business Profile (default on)
    if (ch.gbp !== false) {
      if (!summary) {
        status = 'failed';
        error = 'No copy to publish';
      } else {
        try {
          gbpPostId = await publishLocalPost({ accountId, locationId, summary, mediaUrls, ctaType: post.ctaType, ctaUrl: post.ctaUrl });
        } catch (e) {
          status = 'failed';
          error = e.message;
        }
      }
    }

    // Channel: Blog
    if (ch.blog) {
      try {
        blogUrl = await publishBlogFor(post);
      } catch (e) {
        error = (error ? error + '; ' : '') + 'blog: ' + e.message;
        if (ch.gbp === false) status = 'failed'; // blog-only schedule that failed
      }
    }

    await withPosts((arr) => {
      const p = arr.find((x) => x.id === post.id);
      if (!p) return null;
      p.status = status;
      p.gbpPostId = gbpPostId;
      p.error = error;
      p.publishedMedia = mediaUrls[0] || null;
      p.publishedAt = status === 'published' ? new Date().toISOString() : null;
      if (blogUrl) p.blogUrl = blogUrl;
      return p;
    }, `gbp: scheduled publish ${post.id} (${status})`);

    results.push({ id: post.id, status, error, blogUrl });
  }

  return res.status(200).json({ action: 'run', count: results.length, results });
}
