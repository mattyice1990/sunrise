# Automated Google Business Profile Posting System — Concept & Build Handoff

> **Purpose of this doc:** Hand off to a builder (human or AI agent) so they can start implementation without further context. It defines the vision, architecture, hard constraints, data model, integrations, and a phased build plan.

---

## 1. Vision

Build an automated "full-stack marketing team" for **Google Business Profile (GBP)** posts. The system posts to clients' Google Business Profiles **daily** to improve **local SEO rankings** (Google rewards fresh, active profiles).

The core loop:

1. Each client has a daily **storyline** — a plan of what content to post.
2. The system **texts the client** (via WhatsApp) a simple prompt: *"Send me 2–3 photos of today's job + where you're working."*
3. The client **replies with photos/video + a short note** (location, what they did).
4. **Claude (vision + copywriting)** turns that raw input into a polished GBP post (caption, before/after framing, location, CTA).
5. Post is published to Google Business Profile (with a human approval step in v1).
6. On a rotating cadence, the system also injects **FAQ**, **promo**, and **educational** posts so the feed isn't only job photos.

**End state:** A client does almost nothing but snap photos and text them in; their GBP stays active daily and their local ranking climbs.

---

## 2. Hard Constraints (READ FIRST — these shape the whole build)

### 2.1 Google Business Profile posting is gated
- Posting programmatically uses the **Google Business Profile APIs** (`localPosts` resource, historically part of the My Business API v4 / now the Business Profile API suite).
- **You must apply for and be granted API access** by Google. The approval process is a real gate (days-to-weeks) and rejects thin applications.
- **Action:** Apply for GBP API access **first**, in parallel with everything else. This is the existential risk.
- **Do NOT** build on web-UI scraping/automation — fragile and against ToS for a real product.

### 2.2 WhatsApp can't freely message on a schedule
- Outbound scheduled messages require the **WhatsApp Business API** (via Meta directly, or a BSP like **Twilio** / 360dialog).
- Outside the **24-hour customer-service window**, you may only send **pre-approved message templates**. The daily "here's today's prompt" message must be an approved template.
- **Inbound** media (client sending photos/videos) is unrestricted and easy via webhook.

### 2.3 Claude access
- A **Claude Max subscription is for interactive app use** (and Claude Code), NOT programmatic backend use.
- The running system needs the **Anthropic API** (separate API key, pay-per-token). Claude is used for: vision (reading photos), copywriting (post text), and following per-client storyline via system prompt.
- Use Max/Claude Code to **build**; use the API to **run**.

---

## 3. System Architecture

```
                    ┌─────────────────────────────────────┐
                    │         Scheduler / Cron             │
                    │  - daily prompt jobs (per client)    │
                    │  - filler post calendar (FAQ/promo)  │
                    └───────────────┬─────────────────────┘
                                    │
              ┌─────────────────────▼──────────────────────┐
              │  WhatsApp template msg: "Today's prompt: X" │
              └─────────────────────┬──────────────────────┘
                                    │ client replies (photos/video + note)
              ┌─────────────────────▼──────────────────────┐
              │  Webhook: receive media + text + location   │
              │  store raw media in object storage          │
              └─────────────────────┬──────────────────────┘
                                    │
              ┌─────────────────────▼──────────────────────┐
              │  Claude (vision + copy)                     │
              │  - analyze photos (before/after detection)  │
              │  - generate post copy per client storyline  │
              │  - suggest CTA + tags                        │
              └─────────────────────┬──────────────────────┘
                                    │ draft post
              ┌─────────────────────▼──────────────────────┐
              │  Approval dashboard (v1)                    │
              │  human green-lights / edits before publish  │
              └─────────────────────┬──────────────────────┘
                                    │ approved
              ┌─────────────────────▼──────────────────────┐
              │  Google Business Profile API (localPosts)   │
              │  publish + log result                       │
              └─────────────────────────────────────────────┘
```

---

## 4. Recommended Tech Stack

| Concern | Recommendation | Notes |
|---|---|---|
| Backend / orchestration | **Node.js (TypeScript)** or Python (FastAPI) | TS preferred for one-language stack with dashboard |
| Always-on host | Railway / Render / Fly.io | Needs persistent process + cron |
| AI | **Anthropic API (Claude)** | Vision + copywriting; model e.g. latest Sonnet for cost/quality |
| Messaging | **Twilio WhatsApp API** | Easiest on-ramp; handles templates + webhooks |
| Scheduling | node-cron / a job queue (BullMQ + Redis) | Daily prompts + filler calendar |
| Database | **PostgreSQL** | Clients, storylines, posts, media metadata |
| Media storage | **S3 / Cloudflare R2** | Raw client uploads + processed assets |
| Approval UI | Next.js dashboard | Review/edit/approve drafts |
| Posting | **Google Business Profile API** | Pending access approval |
| Auth (Google) | OAuth 2.0 per GBP account | Store/refresh tokens securely |

---

## 5. Data Model (initial)

```sql
-- Clients (businesses we manage)
clients (
  id, name, business_type, timezone,
  whatsapp_number, gbp_account_id, gbp_location_id,
  google_oauth_refresh_token, status, created_at
)

-- Per-client posting strategy / voice
storylines (
  id, client_id, voice_tone, target_keywords[],
  weekly_cadence_json,        -- e.g. Mon=job, Wed=FAQ, Fri=promo
  daily_prompt_template,      -- what we ask them each day
  do_not_post_rules, created_at
)

-- Inbound submissions from clients
submissions (
  id, client_id, received_at, raw_text, location_text,
  media[] (urls + types), source (whatsapp), status
)

-- Generated/approved posts
posts (
  id, client_id, submission_id (nullable for filler),
  type (job|before_after|faq|promo|educational),
  draft_copy, final_copy, media_urls[],
  cta_type, cta_url, status (draft|approved|published|failed),
  gbp_post_id, scheduled_for, published_at, error_log
)

-- Content calendar / filler scheduling
calendar_entries (
  id, client_id, date, planned_type, status
)

-- Message log (WhatsApp in/out)
messages (
  id, client_id, direction, template_name, body,
  media_urls[], wa_message_id, created_at
)
```

---

## 6. Claude Integration Detail

**Vision step (per submission):**
- Input: client photos/video frames + their note + storyline context.
- Output (structured JSON): scene description, detected before/after pair, suggested post type, location reference, quality flags (blurry / not relevant).

**Copywriting step:**
- System prompt encodes the client's **storyline**: voice/tone, target local-SEO keywords, business type, CTA preferences, do-not-say rules.
- Output: post copy (length-appropriate for GBP, ~1500 char max), suggested CTA, and which media to attach.

**Filler content step (scheduled):**
- Generates FAQ / promo / educational posts from a client knowledge base + storyline, no client input required.

> Keep prompts/templates versioned in the repo so output quality is reproducible and tunable.

---

## 7. Content Cadence (default, tunable per client)

| Day | Default post type |
|---|---|
| Mon | Job / progress photo |
| Tue | Job / before-after |
| Wed | FAQ (answer a common customer question) |
| Thu | Job / progress photo |
| Fri | Promo / offer |
| Sat | Educational / tip |
| Sun | Job highlight or rest |

- If a client doesn't submit photos on a job day, **fall back to a filler post** so the daily streak isn't broken.

---

## 8. Build Phases

### Phase 0 — De-risk (do immediately, in parallel)
- [ ] Apply for **Google Business Profile API** access (longest pole).
- [ ] Set up **Twilio WhatsApp** sandbox + submit first message template for approval.
- [ ] Get **Anthropic API** key.

### Phase 1 — MVP for ONE client (no GBP API dependency)
- [ ] WhatsApp inbound webhook → store media + note.
- [ ] Claude pipeline → generate draft post.
- [ ] Simple approval dashboard (review/edit/approve).
- [ ] On approval: **manual** publish to GBP (copy/paste) while API access pending.
- [ ] Validates content quality + the client texting loop end-to-end.

### Phase 2 — Automate posting
- [ ] Integrate GBP API once access granted; replace manual step with `localPosts` publish.
- [ ] OAuth flow + token refresh per client.
- [ ] Post status logging + retry on failure.

### Phase 3 — Scale & intelligence
- [ ] Multi-client storylines + per-client onboarding flow.
- [ ] Daily scheduler + filler calendar (FAQ/promo rotation).
- [ ] Auto-fallback to filler when no submission.
- [ ] Analytics: posting streaks, GBP insights (views/clicks/calls), ranking proxy metrics.

### Phase 4 — Productize (optional SaaS)
- [ ] Self-serve client onboarding, billing, multi-tenant dashboard.

---

## 9. Environment / Config (to be filled by builder)

```
ANTHROPIC_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GBP_API_PROJECT_ID=
DATABASE_URL=
S3_BUCKET= / R2 creds
APP_BASE_URL=          # for OAuth redirect + dashboard
```

---

## 10. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| GBP API access denied/slow | Build Phase 1 to work with manual posting; strong API application with real business case |
| WhatsApp template rejected | Keep prompt templates generic/utility-style; have SMS fallback (Twilio SMS) |
| Low-quality client photos | Claude flags bad media + asks for a re-send via WhatsApp |
| Posting looks spammy / repetitive | Storyline + content-type rotation + Claude voice tuning |
| GBP ToS / posting frequency | Stay within Google's posting norms; daily is fine, avoid duplicate/templated spam |
| Token/credential security | Encrypt refresh tokens at rest; least-privilege secrets management |

---

## 11. Open Questions (for product owner)

1. How many clients at launch? (Affects multi-tenant priority.)
2. Single agency use first, or SaaS from day one?
3. Approval: always human-in-the-loop, or auto-publish for trusted clients after N good posts?
4. Budget ceiling per client/month for API + messaging costs?
5. Which business verticals first? (Trades/home services seem implied — drives storyline templates.)

---

## 12. Definition of Done (MVP / Phase 1)

- A real client receives a daily WhatsApp prompt.
- They reply with photos + a note.
- A polished GBP-ready draft post is generated automatically within minutes.
- The owner can review/edit/approve in a dashboard.
- Approved post is published to the client's Google Business Profile (manually in P1, automatically in P2) and logged.

---

*Handoff note to the building agent: Start with Phase 0 de-risking and Phase 1 MVP. Do not block on Google API access — architect Phase 1 so posting is a swappable step (manual → API). Keep all Claude prompts versioned in the repo.*
