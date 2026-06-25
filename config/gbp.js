/**
 * GBP automation config for Sunrise (single-tenant, client #1).
 * Public-safe values only. Secrets (API keys, tokens, OAuth) live in Vercel
 * env vars — never here.
 *
 * Account/location IDs are read from env (set after running /api/gbp-accounts).
 */

export const GBP = {
  // Business identity (used in Claude prompts).
  businessName: 'Sunrise Roofing',
  businessType: 'Roofing contractor (residential + commercial), Tucson AZ',
  serviceArea: 'Tucson, Oro Valley, Marana, Catalina Foothills, Green Valley, Vail',

  // Brand voice for the posts. Sunrise is Eddie & Viky Guillen, a Tucson family
  // (ROC #358079, 20+ yrs, GAF-certified). First-person, plainspoken, confident,
  // a little personality; contractions; hard-varied sentence length (short punches
  // mixed with longer lines); concrete desert/monsoon detail. Never salesy, hypey,
  // or generic-AI. Think "you call, you get Eddie" — a real roofer, not a brochure.
  voiceTone:
    "first-person family roofer (Eddie & Viky Guillen, Tucson); plainspoken, confident, a little personality; contractions, hard-varied sentence length, concrete desert detail; never salesy, hypey, or generic-AI",
  targetKeywords: [
    'roofing contractor Tucson',
    'roof repair Tucson',
    'roof replacement',
    'tile roof repair',
    'flat roof coating',
  ],
  ctaPreference: 'CALL', // default CTA for job posts
  doNotPostRules:
    'Never quote specific prices. No customer faces, house numbers, or full addresses. No guarantees/warranty claims. Keep it local and factual.',

  // Facebook Page channel (Meta Graph API). Token + page id live in Vercel env
  // (FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN — use a Business System User token so it
  // doesn't expire). Off by default: a post must opt into the `facebook` channel,
  // and nothing posts unless the env vars are also set.
  facebook: {
    defaultOn: false,
  },

  // Default weekly content cadence (tunable). Filler types need no photos.
  weeklyCadence: {
    sun: 'job',
    mon: 'job',
    tue: 'before_after',
    wed: 'faq',
    thu: 'job',
    fri: 'promo',
    sat: 'educational',
  },

  // Where committed media is publicly served from (for GBP + admin preview).
  mediaBaseUrl: 'https://roofwithsunrise.com',
  mediaDir: 'gbp-media', // committed under repo root -> /gbp-media/<id>/<n>.jpg

  // Repo-as-store: the posts index file (committed JSON).
  postsIndexPath: 'data/gbp/posts.json',

  // GitHub repo coordinates (same as blog-webhook.js).
  github: { owner: 'mattyice1990', repo: 'sunrise', branch: 'main' },

  // ── Daily prompt / reminder cron ──────────────────────────────────
  // Who receives the "send me today's photos" text (the crew/operator).
  promptRecipient: 'whatsapp:+15203068136',
  // Business hours window (Tucson = America/Phoenix, no DST = UTC-7).
  promptTimezoneOffset: -7,
  promptStartHour: 8, // first prompt at 8 AM
  promptEndHour: 21, // stop reminding after 9 PM
  dailyPromptText:
    "Morning! Send 2-3 photos of today's job + the town you're working in, and I'll get it posted to your Google Business Profile.",
  reminderText:
    "Reminder — I still need today's job photos. Send 2-3 (plus the town) whenever you get a sec and I'll post them.",

  // ── Website "recent work" proof layer ────────────────────────────────
  recentWork: {
    heading: 'Recent Roofing Projects Near Tucson',
    defaultCtaText: 'Request a Roof Inspection',
    defaultCtaUrl: '/roof-inspection',
    jitterRadiusMiles: 1.5, // approximate-pin privacy offset
    maxItems: 24,
  },
  // Service type -> real Sunrise service page. Ordered specific → generic;
  // first keyword hit wins. Keywords matched against post copy + note.
  serviceMappings: [
    { service: 'Tile Roof Repair', keywords: ['tile roof repair', 'broken tile', 'broken tiles', 'cracked tile', 'clay tile', 'tile repair'], page: '/tile-roofing' },
    { service: 'Concrete Tile Roof Replacement', keywords: ['concrete tile'], page: '/roof-replacement' },
    { service: 'Shingle Roof Replacement', keywords: ['shingle'], page: '/shingle-roofing' },
    { service: 'Flat Roof Coating', keywords: ['flat roof', 'roof coating', 'elastomeric', 'recoat'], page: '/flat-roofing' },
    { service: 'Metal Roofing', keywords: ['metal roof', 'standing seam'], page: '/metal-roofing' },
    { service: 'Emergency Roof Repair', keywords: ['emergency', 'storm damage', 'leak emergency'], page: '/emergency-roof-repair' },
    { service: 'Roof Inspection', keywords: ['inspection', 'inspect'], page: '/roof-inspection' },
    { service: 'Roof Replacement', keywords: ['replacement', 'new roof', 'tear off', 'tear-off', 'reroof', 're-roof', 'replaced the roof'], page: '/roof-installation' },
    { service: 'Roof Repair', keywords: ['repair', 'leak', 'patch', 'seal'], page: '/roof-repair' },
  ],
  defaultServicePage: '/roofing-tucson',
  // City/area -> approximate center coords + real Sunrise location page.
  serviceAreas: [
    { city: 'Oro Valley', lat: 32.3909, lng: -110.9665, page: '/roofing-oro-valley' },
    { city: 'Marana', lat: 32.4367, lng: -111.2235, page: '/roofing-marana' },
    { city: 'Catalina Foothills', lat: 32.2992, lng: -110.9212, page: '/roofing-tucson' },
    { city: 'Green Valley', lat: 31.8543, lng: -110.9943, page: '/roofing-sahuarita-green-valley' },
    { city: 'Sahuarita', lat: 31.9573, lng: -110.9559, page: '/roofing-sahuarita-green-valley' },
    { city: 'Vail', lat: 32.0481, lng: -110.7126, page: '/roofing-vail-az' },
    { city: 'Rita Ranch', lat: 32.1153, lng: -110.7826, page: '/roofing-tucson' },
    // Additional Tucson-metro communities (no dedicated page yet -> general service-areas page).
    { city: 'SaddleBrooke', lat: 32.5469, lng: -110.8665, page: '/roofing-tucson' },
    { city: 'Catalina', lat: 32.5042, lng: -110.9209, page: '/roofing-tucson' },
    { city: 'Tanque Verde', lat: 32.2531, lng: -110.7376, page: '/roofing-tucson' },
    { city: 'Casas Adobes', lat: 32.3331, lng: -111.0119, page: '/roofing-tucson' },
    { city: 'Tucson', lat: 32.2226, lng: -110.9747, page: '/roofing-tucson' },
  ],
  defaultArea: { city: 'Tucson', lat: 32.2226, lng: -110.9747, page: '/roofing-tucson' },
};

/** GBP API target IDs — filled in Vercel env after OAuth + /api/gbp-accounts. */
export function gbpTarget() {
  return {
    accountId: process.env.GBP_ACCOUNT_ID || null, // e.g. "accounts/123..."
    locationId: process.env.GBP_LOCATION_ID || null, // e.g. "locations/456..."
  };
}
