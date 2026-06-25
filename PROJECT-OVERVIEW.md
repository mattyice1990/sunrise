# Sunrise Roofers — Project Overview & Roadmap

> Single source of truth for how this project works today and where it's headed.
> Last updated: 2026-06-24.

---

## 1. What this is

- **Business:** Sunrise Roofers LLC — family-owned roofing contractor in Tucson, AZ. Owners **Eddie & Viky Guillen**. License **ROC #358079**. GAF-certified. 20+ years on Arizona roofs.
- **Site:** https://roofwithsunrise.com — hosted on **Vercel**, repo **`mattyice1990/sunrise`** (branch `main`).
- **What it really is under the hood:** a marketing website **plus** a small automated content-marketing engine (the "GBP app") that turns job photos into Google Business Profile posts and blog articles with almost no manual work.

---

## 2. Architecture

### 2.1 Frontend — React SPA (not Next.js)
- Client-rendered React. Source JSX lives in `sunrise/components/*.jsx` and `sunrise/seo/seo-page.jsx`.
- **Precompiled** to plain JS by `scripts/build-jsx.mjs` (classic React runtime, each file IIFE-wrapped to avoid global collisions). **Workflow: edit `.jsx` → run `node scripts/build-jsx.mjs` → commit both `.jsx` and the generated `.js`.**
- Components share state via `window` (`Object.assign(window, {...})`).
- Each page is a thin HTML shell (`index.html`, `roof-repair.html`, …) with a **boot splash** (branded loader + screen-reader-only crawlable nav) and a `window.__page` key. React's `createRoot().render()` replaces the splash on mount.
- Uses **production React 18.3.1** (CDN, SRI-pinned).

### 2.2 SEO page system
- Data-driven. All service/area/core page content lives in `sunrise/seo/data-*.js`:
  - `data-services-1.js`, `data-services-2.js` — service pages (roof-repair, metal-roofing, …)
  - `data-areas.js` — service-area pages (Tucson, Oro Valley, Marana, …) built from a shared `areaPage()` template
  - `data-segments.js` — residential/commercial
  - `data-core.js` — about, contact, reviews, resources, etc.
- `seo-page.js` renders `window.SEO[window.__page]`. `<GoogleReviews/>` auto-renders on every SEO page.
- `seo-links.js` centralizes internal URL building.

### 2.3 Blog system
- Posts are **static HTML** at `blog/<slug>/index.html` — a separate, older visual template (Bebas/Oswald, dark header) from the React site.
- `/blog` index lists posts. The grid is enhanced by `blog/blog-loader.js` (reads `blog/blog-posts.json`), but **static crawlable `<a>` cards are pre-rendered** into `blog/index.html` so posts are never orphaned for non-JS crawlers.
- `scripts/build-blog-index.mjs` regenerates those static cards from `blog-posts.json` (run after adding/removing a post).

### 2.4 The GBP app — the content engine (the important part)
Turns job photos into published content automatically.

```
Eddie texts job photos + a note via WhatsApp
  └─► api/gbp-whatsapp-webhook.js          (Twilio verifies signature, downloads photos)
        └─► lib/gbp/store.js  →  commits photos to gbp-media/<id>/ and appends a
            "new" post to data/gbp/posts.json   (the repo itself is the database)

Crons (vercel.json):
  • api/gbp-cron.js          every 3h  — texts Eddie the daily "send today's photos"
                                          prompt/reminder (goes quiet once photos arrive)
  • api/gbp-run-scheduled.js every 5m  — the worker:
       1. drafts GBP post copy from the photos        (lib/gbp/claude.js, Claude)
       2. optionally auto-publishes to Google Business (lib/gbp/google.js, GBP API)
       3. if the blog channel is on → generates an SEO article (lib/gbp/blog.js, Claude)
            └─► POST /api/blog-webhook → humanize → commit blog/<slug>/ → rebuild /blog index

api/gbp-admin (gbp-admin.html)  — web UI to review / edit / approve / schedule drafts
```

**Key files**
- `api/gbp-*.js` — thin HTTP handlers (whatsapp intake, cron, admin actions, OAuth, reviews, media).
- `lib/gbp/` — the real engine:
  - `store.js` — repo-as-store (GitHub Contents API: `data/gbp/posts.json` + `gbp-media/`)
  - `claude.js` — GBP post-copy drafting via Claude
  - `blog.js` — long-form SEO article generation via Claude (+ embeds the most relevant video from the YouTube channel)
  - `google.js` — Google Business Profile API (publish posts, list, OAuth)
  - `twilio.js` — WhatsApp send/receive
  - `email.js` — operator notifications (Resend)
  - `auth.js`, `proof.js`
- `config/gbp.js` — all public-safe config: business identity, **brand voice**, target keywords, content cadence, GBP target IDs source, repo coordinates.

### 2.5 The shared blog-publish endpoint — `api/blog-webhook.js`
- Originally built for outrank.so (no longer used). The GBP app now **reuses it** as the single "publish a blog post" mechanism (auth via `OUTRANK_ACCESS_TOKEN`, a legacy env-var name still in use).
- Responsibilities: receive an article → **humanize it** (`humanizeArticleHtml()`, see §3) → render the post HTML template → commit to GitHub → update `blog-posts.json` → regenerate the static `/blog` index cards.

### 2.6 Infra & conventions
- **Deploy gate:** commits must be authored **and** committed as `mattyice1990 <matt@pursuitanalytics.com>` or the Vercel deploy lands in BLOCKED. Use `git -c user.name=… -c user.email=… commit --author="…"`.
- **Pushing** often needs `git pull --rebase` first (automated GBP commits land on `main`).
- **Redirects:** `vercel.json` (308 permanent, SEO-equivalent to 301); `cleanUrls:true`, `trailingSlash:false`; `.html` → extensionless.
- **Crons:** `gbp-cron` (every 3h), `gbp-run-scheduled` (every 5m).
- **Repo-as-database:** GBP posts (`data/gbp/posts.json`) and media (`gbp-media/`) are committed files. Simple and free — but a scaling ceiling (see §5).

---

## 3. Content / voice work (done June 2026)

The blog was flagged "high AI content" because posts were machine-written. Fixed:
- **All 44 blog posts** rewritten into the owner voice (Eddie & Viky, plainspoken, hard-varied sentence length, concrete desert detail) — verified to preserve every link/image/iframe/heading; AI-filler phrases 70 → 0.
- **Hero + 6 service-area pages** rewritten in the same voice.
- **Source fix:** `lib/gbp/blog.js` generation prompt now writes as Eddie with explicit human-writing rules + a banned-phrase list, so new posts come out human on the first draft. `api/blog-webhook.js`'s `humanizeArticleHtml()` is a **backstop** second pass (cheap Haiku model) that catches anything that slips through.
- **Model:** GBP generation defaults bumped to **Claude Sonnet 4.6** (overridable via `ANTHROPIC_MODEL`).

**Owner voice reference:** first-person, family-owned, "you call, you get Eddie," "no commission reps, no closers," "I won't put anything up there I wouldn't put on my own house." Roofing is a **family trade** — NOT "learned from his dad."

---

## 4. External services & environment variables

Secrets live in Vercel env vars (never in the repo).

| Area | Env vars | Notes |
|---|---|---|
| **Anthropic (Claude)** | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Generates GBP post copy + blog articles. Default model `claude-sonnet-4-6`. |
| **Blog publish auth** | `OUTRANK_ACCESS_TOKEN` | Legacy name; shared secret between the GBP app and `/api/blog-webhook`. |
| **GitHub (repo-as-store)** | `GITHUB_TOKEN` | Commits posts, media, blog files. |
| **Google Business Profile** | `GOOGLE_OAUTH_CLIENT_ID/SECRET`, `GBP_OAUTH_REFRESH_TOKEN`, `GBP_ACCOUNT_ID`, `GBP_LOCATION_ID`, `GBP_OAUTH_STATE_SECRET` | Posts to GBP via `mybusiness*.googleapis.com`. |
| **Google Places** | `GOOGLE_PLACES_API_KEY` | Pulls reviews. |
| **Twilio (WhatsApp)** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `TWILIO_DAILY_PROMPT_TEMPLATE_SID` | Photo intake + daily prompt. |
| **Email** | `RESEND_API_KEY`, `GBP_EMAIL_FROM`, `GBP_NOTIFY_TO` | Operator notifications. |
| **YouTube** | `YOUTUBE_API_KEY`, `YT_CHANNEL_ID`, `YT_CHANNEL_HANDLE` | Finds + embeds relevant channel videos in blog posts. |
| **Facebook (Meta)** | `FB_PAGE_ID`, `FB_PAGE_ACCESS_TOKEN`, `FB_GRAPH_VERSION` (optional) | Posts to the FB Page (`lib/gbp/facebook.js`). Use a Business **System User** token so it never expires. Live as of 2026-06-24. |
| **Crew upload page** | `GBP_UPLOAD_KEY`, `GOOGLE_GEOCODING_API_KEY` (optional, falls back to `GOOGLE_PLACES_API_KEY`) | Auth key for the `/job-upload` page + reverse-geocoding for `api/gbp-upload.js`. |
| **Admin / cron auth** | `GBP_ACCESS_TOKEN`, `CRON_SECRET`, `GBP_AUTO_PUBLISH`, `APP_BASE_URL` | Bearer for admin endpoints; cron authorization; auto-publish toggle. |

---

## 5. Proposed direction — content/marketing autopilot → SaaS

**Vision:** extend the GBP engine into a multi-channel content & marketing system: auto-edit raw YouTube footage into shorts, post to Instagram/Facebook/YouTube, generate Meta ad creative from the videos, keep the blog (already embeds YouTube) flowing — and eventually productize it as a multi-tenant SaaS.

**Why the foundation fits:** the existing pattern — *intake → repo store → cron worker → Claude generation → channel fan-out → publish* — is already a single-channel version of this. The post model already has a `channels` concept (`{gbp, blog}`); new channels slot in naturally.

### Feasibility tiers (honest)
- **Easy / mostly done**
  - Blog with pics + YouTube links — already live (`lib/gbp/blog.js` embeds the best channel video).
  - Multi-channel posting (IG Reels/photos, FB Page, YouTube uploads) — plumbing via Meta Graph API + YouTube Data API. Add as channels.
  - Meta ad creative generation (copy + clipped video variations) via Meta Marketing API.
- **Medium (real work, use off-the-shelf first)**
  - Shorts from raw footage: transcribe (Whisper/Deepgram) → LLM picks best moments → ffmpeg cut to vertical + auto-captions. Tools like OpusClip/Vizard/Klap already do the hard 80% — integrate before building.
- **Hard / overhyped — set expectations**
  - "Be a professional video editor" — AI does *good social shorts*, not autonomous pro editing (b-roll, music, pacing, taste). Aim for "great shorts on autopilot."
  - "Grow a following" — automation handles cadence/posting, not growth itself (that's content quality + hooks + consistency).

### SaaS reality (the big lift)
Current system is **single-tenant** ("client #1", hardcoded to Sunrise, repo-as-database). To productize:
- Multi-tenancy: per-client config, accounts, OAuth tokens, isolated data.
- Real **database + object storage** (Postgres + S3/R2) — repo-as-store won't scale past a handful of clients.
- Billing, onboarding, a dashboard, and the support burden of other people's Google/Meta accounts.
- **Heavy jobs need a queue + worker**, not a 60s Vercel function — video processing especially (consider a worker on Railway/Fly/Render or a managed queue).

### Recommended sequencing
1. **Prove it on Sunrise first** — shorts + IG/FB posting + ads loop for the roofing business. Real results = the best SaaS sales asset.
2. **Buy the hard parts before building them** (off-the-shelf clipping at first).
3. **Multi-tenant only after one client clearly works** — don't build SaaS scaffolding around an unproven loop.

---

## 6. Facebook integration — ✅ LIVE (token + env vars set in Vercel 2026-06-24)

Posts the Sunrise **Facebook Page** as a new `facebook` channel, using the same job content already going to GBP/blog. `FB_PAGE_ID` + `FB_PAGE_ACCESS_TOKEN` (a non-expiring Business System User token) are set in Vercel. Each post still opts in via the Facebook checkbox, so nothing posts to FB unless you tick it — on either "Publish now" or "Schedule for later".

**What's done (code):**
- `lib/gbp/facebook.js` — `publishToFacebook({ message, mediaUrls, link })` via Meta Graph API. 0 photos → `/feed`; 1 photo → `/photos` (caption); 2+ → upload unpublished then one `/feed` album post. Returns `{id, url}`; skips a bad photo rather than failing the whole post.
- `config/gbp.js` — `facebook: { defaultOn: false }`.
- `api/gbp-run-scheduled.js` — a `ch.facebook` block alongside `ch.gbp`/`ch.blog` (independent try/catch — a FB failure never blocks the others); stores `fbPostId`/`fbUrl` on the post.
- `gbp-admin.html` — a real **Facebook Page** checkbox in the scheduler + a "View on Facebook ↗" link on each published post.

**What unblocks it (YOUR part — the real work):** a durable Page token.
- Recommended: a Business **System User** token with `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` (non-expiring, no app review for assets your Business owns).
- Then set Vercel env vars `FB_PAGE_ID` + `FB_PAGE_ACCESS_TOKEN` (optional `FB_GRAPH_VERSION`, default `v21.0`).
- Page is `Sunrise-Roofers-LLC` (id likely `61580211666613`); your Meta Business already exists (Pixel `1351630159967766`).

**Next phases:** v2 auto-publish FB on the auto path · v3 video/Reels · v4 Instagram (IG Business account linked to the Page, reuses the Graph API).

Note: the Meta **Pixel** already on blog posts (`connect.facebook.net`) is tracking — separate from this posting integration.

## 7. Crew GPS upload page — ✅ built 2026-06-24

A second intake path alongside WhatsApp, built to capture **job location automatically** (WhatsApp strips photo EXIF/GPS; verified on a real received photo — zero metadata survives).

- **`job-upload.html`** (served at `/job-upload?k=<GBP_UPLOAD_KEY>`, noindex): mobile page the crew adds to their home screen. Reads each photo's **embedded GPS via `exifr` entirely on-device** (the *capture* location — works even if uploaded later), falling back to live `navigator.geolocation` (only accurate if sent from the site). Shows the crew which one it got. Downscales photos client-side (1280px) before upload.
- **`api/gbp-upload.js`**: key-protected; commits photos to `gbp-media/`, reverse-geocodes the coords to an address, and creates a `new` submission in `data/gbp/posts.json` with a `geo` field — same pipeline as WhatsApp, so drafting/GBP/Facebook work unchanged.
- **Admin**: each card shows `📍 <area> · from photo / live · map ↗`.
- **iPhone caveat:** whether Safari preserves EXIF on web upload varies by iOS version — the page doubles as the test (open on the crew's actual phones; a "📍 from photo" badge = it works). Requires camera Location Services on (one-time).
- **Setup:** set `GBP_UPLOAD_KEY` in Vercel, enable the Google **Geocoding API** on the Maps/Places key, share `https://roofwithsunrise.com/job-upload?k=<key>` with the crew.

---

*This doc reflects the codebase + decisions as of 2026-06-24. Keep it updated as the platform grows.*
