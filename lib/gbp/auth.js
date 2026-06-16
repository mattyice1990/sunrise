/**
 * Bearer-token auth for protected GBP endpoints.
 * Same convention as api/blog-webhook.js (OUTRANK_ACCESS_TOKEN), but its own
 * token so the two systems are isolated.
 */
export function validateBearer(req) {
  const TOKEN = process.env.GBP_ACCESS_TOKEN;
  if (!TOKEN) {
    console.error('GBP_ACCESS_TOKEN environment variable not set');
    return false;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.split(' ')[1] === TOKEN;
}
