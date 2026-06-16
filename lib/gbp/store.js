/**
 * Repo-as-store. Reuses the GitHub Contents API pattern from blog-webhook.js.
 * - Posts index: a single JSON array committed at config GBP.postsIndexPath.
 * - Media: image files committed under GBP.mediaDir, served publicly by Vercel.
 *
 * Reads use the Contents API (fresh + returns sha for the next write), so we
 * avoid raw.githubusercontent CDN staleness.
 */
import { GBP } from '../../config/gbp.js';

const { owner, repo, branch } = GBP.github;
const API = (path) => `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

function ghHeaders() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error('GITHUB_TOKEN environment variable not set');
  return { Authorization: `Bearer ${t}`, Accept: 'application/vnd.github+json' };
}

/** GET a file. Returns { content: string|null, sha: string|null }. */
async function getFile(path) {
  const res = await fetch(`${API(path)}?ref=${branch}`, { headers: ghHeaders() });
  if (res.status === 404) return { content: null, sha: null };
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

/** PUT a file (create or update). `body` may be a string or Buffer. */
async function putFile(path, body, message, sha) {
  const base64 = Buffer.isBuffer(body)
    ? body.toString('base64')
    : Buffer.from(body, 'utf8').toString('base64');
  const res = await fetch(API(path), {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: base64, branch, ...(sha && { sha }) }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Read the posts index (array). */
export async function readPosts() {
  const { content } = await getFile(GBP.postsIndexPath);
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/** Commit one media buffer; returns its public URL. */
export async function putMedia(postId, index, buffer, ext, message) {
  const path = `${GBP.mediaDir}/${postId}/${index}.${ext}`;
  const existing = await getFile(path).catch(() => ({ sha: null }));
  await putFile(path, buffer, message, existing.sha);
  return `${GBP.mediaBaseUrl}/${path}`;
}

/**
 * Insert or update a post in the index. Read-modify-write with sha; one retry
 * on a concurrent-write conflict (409). `mutate(posts)` edits the array.
 */
export async function withPosts(mutate, message) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { content, sha } = await getFile(GBP.postsIndexPath);
    const posts = content ? JSON.parse(content) : [];
    const result = mutate(posts);
    try {
      await putFile(GBP.postsIndexPath, JSON.stringify(posts, null, 2), message, sha);
      return result;
    } catch (e) {
      if (attempt === 0 && String(e.message).includes('409')) continue; // retry once
      throw e;
    }
  }
}
