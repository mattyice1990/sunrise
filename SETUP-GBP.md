# Sunrise GBP Automation — Setup & Go-Live Runbook

Automated Google Business Profile posting, integrated into the Sunrise site.
**Loop:** crew texts job photos to WhatsApp → photos commit to the repo → Claude
writes the GBP post → you review/edit/approve at `/gbp-admin` → published to
Google Business Profile via the API.

Single-tenant tonight: Sunrise's own profile. No database — state lives in the
repo (`data/gbp/posts.json` + `/gbp-media/`), reusing the `blog-webhook.js`
GitHub-commit pattern. No new npm dependencies; everything is raw `fetch`.

---

## What got added
```
config/gbp.js                  Sunrise storyline (voice, keywords, rules, cadence) + ID accessors
lib/gbp/auth.js                Bearer-token check (GBP_ACCESS_TOKEN)
lib/gbp/store.js               Repo-as-store: read/commit posts.json + media (GitHub API)
lib/gbp/claude.js              Vision + copywriting (Anthropic Messages API)
lib/gbp/google.js              OAuth + accounts/locations + localPosts publish
lib/gbp/twilio.js              Inbound parse + signature verify + media download
api/gbp-whatsapp-webhook.js    Twilio inbound → store photos + submission
api/gbp-generate.js            Run Claude on a submission → draft   (Bearer)
api/gbp-posts.js               List posts for the admin page        (Bearer)
api/gbp-publish.js             Publish a draft to GBP               (Bearer)
api/gbp-oauth-start.js         One-time Google consent              (secret)
api/gbp-oauth-callback.js      Shows the refresh token to copy      (secret)
api/gbp-accounts.js            List GBP account/location IDs        (Bearer)
gbp-admin.html                 Token-gated review/approve UI  → /gbp-admin
data/gbp/posts.json            Posts index (starts empty)
```

## 1. Environment variables (Vercel → Settings → Environment Variables)
Add these to the **sunrise** project (Production), then redeploy.

| Var | What |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key (pay-per-token, not Claude Max) |
| `ANTHROPIC_MODEL` | optional; defaults to `claude-sonnet-4-5` |
| `TWILIO_ACCOUNT_SID` | Twilio SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token (also used to verify webhook signatures) |
| `TWILIO_WHATSAPP_NUMBER` | e.g. `whatsapp:+1...` (sandbox is fine to start) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google Cloud OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google Cloud OAuth client secret |
| `GBP_OAUTH_REFRESH_TOKEN` | filled in step 3 |
| `GBP_ACCOUNT_ID` | filled in step 4 (e.g. `accounts/1234`) |
| `GBP_LOCATION_ID` | filled in step 4 (e.g. `locations/5678`) |
| `GBP_ACCESS_TOKEN` | a long random string you invent — the admin/login token |
| `GBP_OAUTH_STATE_SECRET` | another random string — guards the OAuth start URL |
| `GITHUB_TOKEN` | already set (used to commit posts/media) |
| `APP_BASE_URL` | optional; defaults to `https://roofwithsunrise.com` |

## 2. Google Cloud OAuth client
In the Cloud project that has **Business Profile API access granted**:
- OAuth consent screen configured; scope `https://www.googleapis.com/auth/business.manage`.
- Create an **OAuth client (Web)**; add redirect URI:
  `https://roofwithsunrise.com/api/gbp-oauth-callback`
- Put its ID/secret in the env vars above.

## 3. One-time Google authorization (mint the refresh token)
After deploying with the env vars from steps 1–2:
1. Visit `https://roofwithsunrise.com/api/gbp-oauth-start?secret=YOUR_GBP_OAUTH_STATE_SECRET`
2. Approve consent with the Google account that manages the Sunrise profile.
3. The callback page shows a **refresh token** → paste it into Vercel as
   `GBP_OAUTH_REFRESH_TOKEN`, then redeploy.

## 4. Get your account + location IDs
1. Open `https://roofwithsunrise.com/api/gbp-accounts` with header
   `Authorization: Bearer YOUR_GBP_ACCESS_TOKEN` (e.g. a REST client, or
   `curl -H "Authorization: Bearer ..."`).
2. Copy the `account` (e.g. `accounts/123`) and the Sunrise `locations/...` name
   into `GBP_ACCOUNT_ID` / `GBP_LOCATION_ID`. Redeploy.

## 5. Point Twilio at the webhook
In the Twilio console (WhatsApp sender / sandbox), set the inbound webhook to:
`https://roofwithsunrise.com/api/gbp-whatsapp-webhook` (HTTP POST).
For the sandbox, join it from your phone, then text it photos.

## 6. Test end-to-end
1. Text 2–3 job photos + a short note (with the town) to the WhatsApp number.
2. Open `https://roofwithsunrise.com/gbp-admin`, enter your `GBP_ACCESS_TOKEN`.
3. The submission appears → **Generate draft** → review/edit copy + CTA →
   **Approve & publish**.
4. Confirm the post on the Google Business Profile.

---

## Notes, limits, and next steps
- **Media hosting:** photos are committed to the repo and served from
  `roofwithsunrise.com/gbp-media/...`. Simple and free, but each inbound photo
  triggers a redeploy and grows the repo. Upgrade path: Vercel Blob or R2.
- **WhatsApp templates:** inbound works immediately. Outbound *scheduled prompts*
  (the daily "send today's photos" nudge) need an approved WhatsApp template —
  add that later; not required for the review-and-publish loop.
- **Refresh token** is stored in a Vercel env var. Fine for single-tenant. For
  multi-client, move tokens to a real store and encrypt at rest.
- **Auth:** the admin page and all write endpoints require `GBP_ACCESS_TOKEN`.
  Keep it secret; rotate by changing the env var.
- **Publish timing:** Google fetches photo URLs at publish time. Since you
  approve a few minutes after the photos land (and deploy), the URLs are live.
