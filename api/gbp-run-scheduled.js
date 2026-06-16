/**
 * Scheduled-publish cron. Runs frequently (see vercel.json crons).
 * Publishes any post with status "scheduled" whose scheduledFor time has
 * arrived. GBP has no native scheduling, so we hold the post and publish it
 * here when due. Auth: Vercel cron header or ?secret=GBP_OAUTH_STATE_SECRET.
 */
import { gbpTarget } from '../config/gbp.js';
import { readPosts, withPosts } from '../lib/gbp/store.js';
import { publishLocalPost } from '../lib/gbp/google.js';
import { generateDraft } from '../lib/gbp/claude.js';
import { emailConfigured, sendEmail, buildReviewEmail } from '../lib/gbp/email.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const isVercelCron = !!req.headers['x-vercel-cron'];
  const secretOk = req.query?.secret && req.query.secret === process.env.GBP_OAUTH_STATE_SECRET;
  if (!isVercelCron && !secretOk) return res.status(403).json({ error: 'Forbidden' });

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
        const mediaUrls = chosen.length ? chosen : post.mediaUrls;
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
          p.status = 'draft';
          p.autoDrafted = true;
          return p;
        }, `gbp: auto-draft ${post.id}`);
      } catch (e) {
        console.error('auto-draft failed', post.id, e.message);
      }
    }

    // Pass B: email any auto-generated draft we haven't notified about yet.
    const after = await readPosts();
    const toNotify = after.filter((p) => p.status === 'draft' && p.autoDrafted && !p.notifiedAt);
    for (const post of toNotify) {
      try {
        const { subject, html } = buildReviewEmail(post);
        await sendEmail({ subject, html });
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

  const now = Date.now();
  const due = posts.filter(
    (p) => p.status === 'scheduled' && p.scheduledFor && new Date(p.scheduledFor).getTime() <= now,
  );
  if (!due.length) return res.status(200).json({ action: 'skip', due: 0 });

  const { accountId, locationId } = gbpTarget();
  const results = [];

  for (const post of due) {
    const summary = (post.finalCopy || post.draftCopy || '').trim();
    const mediaUrls = post.compositeUrl ? [post.compositeUrl] : post.mediaUrls || [];
    let gbpPostId = null;
    let error = null;
    let status = 'published';

    if (!summary) {
      status = 'failed';
      error = 'No copy to publish';
    } else {
      try {
        gbpPostId = await publishLocalPost({
          accountId,
          locationId,
          summary,
          mediaUrls,
          ctaType: post.ctaType,
          ctaUrl: post.ctaUrl,
        });
      } catch (e) {
        status = 'failed';
        error = e.message;
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
      return p;
    }, `gbp: scheduled publish ${post.id} (${status})`);

    results.push({ id: post.id, status, error });
  }

  return res.status(200).json({ action: 'run', count: results.length, results });
}
