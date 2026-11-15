/* sync-reviews.mjs — snapshot the live Google reviews into data/reviews.json.
 *
 *     node scripts/sync-reviews.mjs          # fetch, write data/reviews.json, update /reviews schema count
 *     node scripts/sync-reviews.mjs --check  # exit 1 if the snapshot is out of date
 *     npm run reviews                        # this, then the prerender
 *
 * WHY: the review carousel is drawn in the browser from /api/gbp-reviews, so a
 * crawler that does not run JavaScript (GPTBot, ClaudeBot, PerplexityBot, and
 * Google's first pass) saw no review text anywhere on the site. The prerender
 * (scripts/prerender.mjs) now writes real reviews into every shell as plain
 * HTML, and it reads them from this snapshot so a build never depends on the
 * network. Browsers still get the live carousel; this is the crawlable copy.
 *
 * Run it when new reviews come in, then `npm run prerender`, and commit both
 * data/reviews.json and the changed *.html shells.
 *
 * Only what is rendered is stored: name, rating, date, text. No profile
 * photos, no review ids, no owner replies.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "reviews.json");
const REVIEWS_PAGE = path.join(ROOT, "reviews.html");
const FEED = process.env.SUNRISE_REVIEWS_URL || "https://roofwithsunrise.com/api/gbp-reviews";
const CHECK = process.argv.includes("--check");
// A feed that comes back nearly empty is a broken feed, not a business that
// lost its reviews. Never overwrite a good snapshot with it.
const MIN_REVIEWS = 10;

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const res = await fetch(FEED, { headers: { accept: "application/json" } });
if (!res.ok) { console.error(`sync-reviews: ${FEED} answered ${res.status}`); process.exit(2); }
const feed = await res.json();

const reviews = (feed.reviews || [])
  .filter((r) => r && clean(r.text) && clean(r.author_name) && Number(r.rating) >= 4)
  .map((r) => ({ name: clean(r.author_name), rating: Number(r.rating), date: r.create_time || null, text: clean(r.text) }))
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

if (reviews.length < MIN_REVIEWS) {
  console.error(`sync-reviews: only ${reviews.length} usable reviews from ${FEED}; refusing to write (expected ${MIN_REVIEWS}+)`);
  process.exit(2);
}

const snapshot = {
  source: "Google Business Profile",
  rating: Number(feed.rating) || 5,
  total: Number(feed.totalReviews) || reviews.length,
  reviews,
};
const json = JSON.stringify(snapshot, null, 2) + "\n";
const before = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";

// The /reviews page states the count in its AggregateRating; keep it honest.
let page = readFileSync(REVIEWS_PAGE, "utf8");
const pageAfter = page
  .replace(/("reviewCount"\s*:\s*")\d+(")/, `$1${snapshot.total}$2`)
  .replace(/("ratingValue"\s*:\s*")[\d.]+(")/, `$1${snapshot.rating.toFixed(1)}$2`);

const stale = json !== before || pageAfter !== page;
if (CHECK) {
  if (stale) { console.error("sync-reviews --check: snapshot is out of date — run: npm run reviews"); process.exit(1); }
  console.log(`sync-reviews --check: up to date (${reviews.length} reviews, ${snapshot.rating.toFixed(1)} from ${snapshot.total}).`);
} else {
  if (json !== before) writeFileSync(OUT, json);
  if (pageAfter !== page) writeFileSync(REVIEWS_PAGE, pageAfter);
  console.log(`sync-reviews: ${reviews.length} reviews, ${snapshot.rating.toFixed(1)} from ${snapshot.total}, newest ${String(reviews[0].date).slice(0, 10)}${stale ? "" : " (no change)"}.`);
}
