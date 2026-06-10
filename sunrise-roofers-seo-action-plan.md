# Sunrise Roofers (roofwithsunrise.com) — SEO/AIO/GEO Implementation Plan
**Prepared for:** Pursuit Analytics coding agents
**Date:** June 9, 2026
**Data sources:** Ahrefs (June 2026), live site crawl, SERP analysis
Each task below is written as a self-contained ticket. Hand tasks to agents in priority order (P0 → P4). Tasks marked **[HUMAN]** cannot be done in code and belong to the account manager / business owner — they're listed at the end so nothing falls through.
**Global rules for all agents working on this site:**
- Preserve existing URL structure. Never change a live URL without adding a 301 redirect.
- All new pages must: be added to `sitemap.xml`, be internally linked from at least 2 existing pages, include exactly one H1, and carry appropriate JSON-LD.
- NAP must appear identically everywhere: `Sunrise Roofers LLC | 7320 N La Cholla Blvd Ste 154-276, Tucson, AZ 85741 | 520-753-1758`
- Canonical hours (use everywhere, including schema): Mon–Fri 7:00 AM–6:00 PM, Sat 8:00 AM–4:00 PM, Sun closed.
- Brand voice: plain-English, no-pressure, communication-first ("daily photos and updates"), family-owned, Tucson/monsoon-specific. Match the tone of the existing homepage.
- Factual guardrails: company founded January 2025 by Eddie & Viky Guillen; Eddie has 20+ years of experience. BBB rating is **A−**, accredited April 2025. GAF-certified. AZ ROC #358079. Never state or imply company awards, ratings, or history that contradict these facts.
---
## P0 — Trust & Accuracy (do first, same day)
### TASK-001: Remove hidden "Award-Winning Excellence" markup + fix visible BBB claim
**Severity:** High (hidden-text spam signal, AI-citation contradiction). Note: this section is NOT visible to users — it is wrapped in `<section style="display:none;">` at lines ~852–879 of the homepage HTML. It appears to be leftover template/placeholder content. Crawlers (Googlebot, GPTBot, PerplexityBot) still read it in the DOM, so the false claims are in indexed content even though no visitor sees them, and hidden text that differs from rendered content is a classic spam signal.
**File(s):** homepage (`index.html` / homepage template); `/why-choose-sunrise-roofers-in-tucson`
**Problem:** The hidden block claims awards from 2020–2024 ("Best of Tucson 2024", "BBB A+ Rating 2023", "HomeAdvisor Top Rated Pro 2022", "Angie's List Super Service Award 2021", "Customer Choice 2020"). The company was founded 1/4/2025 and BBB lists an A− rating. Separately, the *visible* why-choose page claims an "A+ BBB rating," which contradicts BBB's published A−.
**Implementation:**
1. Delete the entire hidden `<!-- Awards Section -->` block (the `<section style="display:none;">` containing all five award cards, homepage lines ~852–879). Do not unhide it — remove it.
2. Grep the full codebase/templates for the same block or claims elsewhere (search: `Award-Winning Excellence`, `Best of Tucson`, `HomeAdvisor`, `Angie`, `Super Service`, `Customer Choice`, `display:none`) and delete any other hidden instances, in case it lives in a shared template.
3. On `/why-choose-sunrise-roofers-in-tucson` (visible content): change "A+ BBB rating" wording to "BBB Accredited" — never state a letter grade that doesn't match BBB's published record.
4. **Optional enhancement (new work, not a correction):** add a visible "Why Tucson Trusts Sunrise" credentials band on the homepage using only verifiable items, each linking to its proof source:
   - **BBB Accredited Business** — link: `https://www.bbb.org/us/az/tucson/profile/roofing-contractors/sunrise-roofers-llc-1286-20125900` (reuse existing BBB SVG; label "BBB Accredited Since 2025")
   - **GAF-Certified Contractor** — link to the company's GAF contractor profile (locate via the existing gaf.com backlink; if not found, label without link)
   - **Licensed, Bonded & Insured — AZ ROC #358079** — reuse existing azroc.my.site.com verification link
   - **5.0★ on Google** — link to the existing Google Maps CID URL already in the footer
   - **Family-Owned, 20+ Years of Roofing Expertise** — link to `/why-choose-sunrise-roofers-in-tucson`
**Acceptance criteria:** `curl -s https://roofwithsunrise.com/ | grep -i "best of tucson\|homeadvisor\|angie\|customer choice\|award-winning"` returns nothing; no `display:none` sections containing marketing claims remain anywhere; no visible page states a BBB letter grade.
### TASK-002: Hours consistency audit + schema
**File(s):** all templates rendering hours (header bar, footer, contact page), homepage JSON-LD
**Implementation:**
1. Grep the codebase for every hours mention; normalize to the canonical hours above.
2. In the LocalBusiness/RoofingContractor JSON-LD, ensure `openingHoursSpecification` exists and matches:

```json
"openingHoursSpecification": [
  {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:00","closes":"18:00"},
  {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"16:00"}
]
```

3. Confirm `telephone`, `address`, `geo`, `url`, `sameAs` (Facebook, Yelp, Instagram, Google Maps CID, BBB profile) are all present in the org schema.
**Acceptance criteria:** One canonical hours string site-wide; schema validates in Google's Rich Results Test.
---
## P1 — On-Page Quick Wins (this week)
### TASK-003: Retitle flat roof coating page to capture "roof coating tucson" + "flat roof repair tucson"
**File:** `/roofing-services/flat-roof-coating-tucson`
**Data:** "roof coating tucson" 100/mo KD12 · "flat roof repair tucson" 150/mo KD38 (TP 1,000) · "roof coating cost" 200/mo KD4
**Implementation:**
1. Title tag → `Flat Roof Coating & Repair in Tucson | Sunrise Roofers LLC` (≤60 chars)
2. H1 → `Flat Roof Coating & Repair in Tucson`
3. Add an H2 section "Flat Roof Repair in Tucson" (~250 words: ponding water, seam splits, monsoon damage, elastomeric/silicone recoat vs. repair decision)
4. Add an H2 "How Much Does Roof Coating Cost in Tucson?" with a 3-row cost-range table (acrylic / silicone / foam recoat, per sq ft ranges) — sourced ranges, conservative, with "every roof is different; free inspection" disclaimer
5. Add 4-item FAQPage JSON-LD targeting conversational queries: "How long does a roof coating last in Arizona?", "Do roof coatings work in Tucson heat?", "Can you repair a flat roof without replacing it?", "How much does flat roof repair cost in Tucson?"
6. Internal links: from homepage services grid (already exists), from `/tucson-roofing-services`, and from the foam roof repair blog post.
**Acceptance criteria:** New title/H1 live; cost table renders; FAQ schema validates; ≥3 internal inlinks.
### TASK-004: Localize the roof inspection page
**File:** `/roofing-services/roof-inspection`
**Data:** "roof inspection tucson" 100/mo KD9
**Implementation:** Title → `Roof Inspection in Tucson, AZ | Free Photo Report`; H1 → `Tucson Roof Inspection — Free Photo-Documented Report`; ensure "Tucson" appears in first 100 words; add a short "When to schedule" section (post-monsoon, pre-purchase, insurance claims); add 3-item FAQ schema.
### TASK-005: Emergency roof repair page (new)
**New URL:** `/roofing-services/emergency-roof-repair-tucson`
**Data:** "emergency roof repair tucson" 80/mo, effectively KD 0
**Implementation:**
1. Build page using the existing service-page template. Title: `24/7 Emergency Roof Repair in Tucson | Sunrise Roofers LLC`. H1: `Emergency Roof Repair in Tucson`.
2. Content outline (~600–800 words): what counts as an emergency (active leak, monsoon/wind damage, fallen debris) → what we do first (emergency dry-in/tarp) → response process → service area (all 6 cities, linked) → what to do while you wait (4 homeowner steps) → insurance claim help → CTA with phone number prominent.
3. Sticky/prominent click-to-call. Footer already advertises "Emergency Service Available" — link that line to this page.
4. Add to Services dropdown nav, footer services list, `/roofing-services` hub, and sitemap.
5. Service JSON-LD (see TASK-006 template) + FAQ schema (response time, after-hours availability, tarping cost, insurance).
**Acceptance criteria:** Page live, in nav + sitemap, schema validates, linked from ≥3 pages.
### TASK-006: Add Service schema to all 8 service pages
**Files:** every page under `/roofing-services/` + `/residential-roofing-tucson`
**Template (adapt `name`, `description`, `url` per page):**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Roof Repair",
  "name": "Roof Repair in Tucson, AZ",
  "url": "https://roofwithsunrise.com/roofing-services/roof-repair-tucson",
  "provider": {"@type": "RoofingContractor", "name": "Sunrise Roofers LLC", "@id": "https://roofwithsunrise.com/#organization"},
  "areaServed": [
    {"@type":"City","name":"Tucson"},{"@type":"City","name":"Oro Valley"},
    {"@type":"City","name":"Marana"},{"@type":"City","name":"Catalina Foothills"},
    {"@type":"City","name":"Sahuarita"},{"@type":"City","name":"Green Valley"},
    {"@type":"City","name":"Vail"}
  ],
  "offers": {"@type":"Offer","description":"Free inspection and line-item estimate"}
}
```

Ensure the homepage org schema has `"@id": "https://roofwithsunrise.com/#organization"` so the provider reference resolves.
**Acceptance criteria:** All service pages validate with Service schema; no duplicate conflicting LocalBusiness blocks per page.
---
## P2 — New Money Pages (this month)
### TASK-007: Tile Roof Repair Tucson page (new) — highest-value new page
**New URL:** `/roofing-services/tile-roof-repair-tucson`
**Data:** "tile roof repair tucson" 150/mo **KD 0** — currently only a tile *replacement* page exists
**Implementation:**
1. Title: `Tile Roof Repair in Tucson, AZ | Sunrise Roofers LLC`. H1: `Tile Roof Repair in Tucson`. Meta: mention cracked/slipped tiles, underlayment, free estimates, ROC license.
2. Content outline (~900–1,100 words):
   - Why tile roofs fail in Tucson (UV-degraded underlayment — tiles outlive underlayment; monsoon wind lift; foot-traffic cracks)
   - Repair vs. replace decision guide (repair: isolated cracked tiles, small leaks; replace underlayment: 20+ yr old felt; full replacement: widespread failure) — this section should be a table or clearly structured list (AI-citable)
   - "How Much Does Tile Roof Repair Cost in Tucson?" — cost-range table by repair type (individual tile swap / flashing repair / partial underlayment / full underlayment R&R per sq ft)
   - Our process (matches existing brand: inspection → photo report → line-item estimate → repair → final photos)
   - Tile types we service (concrete, clay, sandcast)
3. Cross-link in BOTH directions with `/roofing-services/concrete-tile-roof-replacement` ("Need full replacement instead?" / "Just need a repair?"). Add to nav dropdown, services hub, footer, sitemap.
4. Service schema (TASK-006 template, serviceType "Tile Roof Repair") + 5-item FAQ schema: cost per tile, can you match my tile, walk on tile roof, underlayment lifespan in Arizona, insurance coverage for monsoon tile damage.
### TASK-008: Foam Roofing Tucson page (new)
**New URL:** `/roofing-services/foam-roofing-tucson`
**Data:** "foam roofing tucson" 50/mo KD 1. The blog already ranks #4 nationally for "foam roof repair" (400/mo) — this captures the local commercial intent that authority has earned.
**Implementation:**
1. Title: `Foam Roofing in Tucson, AZ | Installation, Repair & Recoating`. H1: `Tucson Foam (SPF) Roofing`.
2. Outline (~800 words): why foam suits Tucson flat roofs (R-value, seamless, reflective) → installation → repair & maintenance → recoating schedule (every 5–10 yrs) → cost factors → FAQ.
3. **Critical internal link:** add a prominent CTA block inside `/blog/foam-roof-repair` (top third of the post): "Need foam roof repair in Tucson? We're local, licensed (ROC #358079), and offer free inspections → [Tucson Foam Roofing Services]". Also link from `/roofing-services/flat-roof-coating-tucson` and the services hub.
4. Service + FAQ schema as above.
### TASK-009: Refresh & defend the foam roof repair blog post
**File:** `/blog/foam-roof-repair` (drives ~93% of current organic traffic — protect it)
**Implementation:**
1. Update the visible published/updated date and `dateModified` in Article schema to current.
2. Add a cost section with a table ("foam roof repair cost" queries are adjacent and the post ranks for `foam roof repair kit` — capture DIY-vs-pro intent with an honest DIY-kit vs professional comparison table).
3. Add the Tucson CTA block from TASK-008.
4. Add FAQ schema (5 questions pulled from People Also Ask for "foam roof repair").
5. Verify Article schema includes `author` (Eddie Guillen, with link to About page) — named authorship is an E-E-A-T/GEO signal.
---
## P3 — Content Cluster & Coverage (this quarter)
### TASK-010: Cost-guide blog cluster (3 posts, publish in this order)
All posts: Article + FAQ schema, named author Eddie Guillen, cost tables with AZ-specific ranges, conservative disclaimers, CTA to the matching service page, 1,200–1,800 words, interlinked with each other.
| # | URL slug | Target keyword | Vol | KD | Links to service page |
|---|----------|----------------|-----|-----|----------------------|
| 1 | `/blog/roof-coating-cost` | roof coating cost | 200 | 4 | flat-roof-coating-tucson |
| 2 | `/blog/tile-roof-underlayment-replacement-cost` | tile roof underlayment replacement cost | 100 | 0 | concrete-tile-roof-replacement + tile-roof-repair-tucson |
| 3 | `/blog/shingle-roof-replacement-cost` | shingle roof replacement cost | 350 | 12 (TP 52,000) | shingle-roof-replacement-tucson |
Structure each as: quick-answer cost range in the first 100 words (AI Overview bait) → cost table by material/size → factors that change price → Arizona-specific considerations (heat, monsoon, HOA) → repair vs replace → FAQ → CTA.
### TASK-011: City pages for Vail and Rita Ranch
**New URLs:** `/vail-roofing`, `/rita-ranch-roofing` (match existing city-page slug pattern)
Both communities are named on the homepage but have no pages. Clone the structure of `/sahuarita-roofing`, write unique localized content (neighborhoods, common roof types in those areas, distance/response time), add to Service Areas nav dropdown, footer, homepage communities list (link the plain-text mentions), sitemap, and each page's Service schema `areaServed`.
### TASK-012: Internal linking pass
After P2/P3 pages exist: every service page links to 2–3 sibling services + 1–2 city pages contextually; every city page links to top 3 services; every blog post links to ≥1 service page. No orphan pages (verify via crawl).
### TASK-013: llms.txt refresh
Update `/llms.txt` to enumerate the new service pages, city pages, and cost guides with one-line descriptions, and state the canonical NAP, license number, hours, and service area. This file is the site's self-description for AI crawlers — keep it current with every page launch.
---
## P4 — Technical Hygiene
### TASK-014: Disavow file
Generate `disavow.txt` from Ahrefs referring-domains export: include all link-seller domains (pattern examples observed: `buybacklinks.agency`, `pbnseolinks.shop`, `ranklinkerpro.shop`, `rankxlinks.shop`, `linkrankpro.shop`, `authoritybacklinks.shop`, `toplinkranker.shop`, `linkseopro.shop`, `premiumseolinks.shop`, `rank-your.website`, `rankyour.website`, `rank-top.click`, `seoexpress.org`, `seozora.com`, `seodaro.com`, `backlinker.shop`, `itxoft-professional-seo-services.site`, `fiverr-cost-effective-seo.site`, `optimize-instant.website`) using `domain:` syntax. **Do NOT include:** bbb.org, gaf.com, gaf.ca, superpages.com, arizonaroofers.com, or any directory/citation site. Output the file for human review — **[HUMAN]** submits in Google Search Console.
### TASK-015: robots.txt cleanup (low priority)
Current file works but is bloated. Simplify to: `User-agent: * / Allow: /` + the two thank-you Disallows + Sitemap line. Keep AI-crawler allowance implicit via `*` (or keep explicit blocks if the team prefers documentation value). Remove the redundant per-page Allow lines.
### TASK-016: Page-speed & image audit
Run Lighthouse on homepage + top 3 service pages. Known candidates: `SunriseLogo.jpeg` and `Roof Installation_edited.jpg` (convert to WebP, add explicit width/height, lazy-load below-fold images, ensure hero image is preloaded). Target LCP < 2.5s mobile.
---
## [HUMAN] Tasks — not codeable, route to account manager / owner
1. **Review engine (top priority overall):** post-job SMS/email with direct Google review link; crew mention at final walkthrough; target 8–10 reviews/mo; respond to every review within 48h naming the service + city. Goal: 30+ reviews by September (pre-monsoon-repair season).
2. **GBP:** fix hours to canonical; verify primary category "Roofing contractor" + secondaries; populate Services (one per service page, with link); weekly Posts (before/after photos, city named); upload 2–3 geotagged photos/week; seed 10 Q&As; add UTM `?utm_source=gbp&utm_medium=organic&utm_campaign=gbp` to the website link.
3. **Citations:** claim/complete Angi, Houzz, Thumbtack, Nextdoor, Porch, Apple Maps (Apple Business Connect), Bing Places. Exact-match NAP + canonical hours everywhere. Update Birdeye listing hours.
4. **Stop any paid link buying immediately** (if applicable); submit TASK-014 disavow in GSC.
5. **Real local links:** GAF contractor case study, Tucson home show participation, chamber membership, supplier "find a contractor" pages, local news monsoon-prep expert commentary (HARO/Qwoted).
6. **Community presence:** encourage genuinely happy customers to share recommendations where they're already active (r/Tucson, Nextdoor). Never astroturf — AI assistants weight these threads heavily and fake posts get burned.
---
## Sequencing & Expected Outcomes
| Phase | Tasks | Timeline | Expected result |
|-------|-------|----------|-----------------|
| P0 | 001–002 | Day 1 | False claims removed from crawlable content; visible BBB wording corrected; consistent entity data for Google + AI |
| P1 | 003–006 | Week 1 | "roof coating tucson", "roof inspection tucson", "emergency roof repair tucson" entering top 10 within 30–45 days |
| P2 | 007–009 | Weeks 2–4 | "tile roof repair tucson" (KD 0) top 3 in 60–90 days; foam local capture; flagship post defended |
| P3 | 010–013 | Months 2–3 | Cost cluster builds authority for KD 35–40 head terms + AI Overview citations |
| P4 + HUMAN | 014–016, all | Ongoing | Map pack movement as reviews compound; DR climbs on real links |
**KPIs to track monthly (Ahrefs + GSC + GBP Insights):** keywords in top 3 / top 10, organic clicks, GBP calls + direction requests, review count & velocity, referring domains (real vs spam ratio).
