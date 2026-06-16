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

  // Brand voice for the posts.
  voiceTone:
    'friendly, trustworthy, plainspoken local roofer; confident but never salesy or hypey',
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
    defaultCtaUrl: '/roofing-services/roof-inspection',
    jitterRadiusMiles: 1.5, // approximate-pin privacy offset
    maxItems: 24,
  },
  // Service type -> real Sunrise service page. Ordered specific → generic;
  // first keyword hit wins. Keywords matched against post copy + note.
  serviceMappings: [
    { service: 'Tile Roof Repair', keywords: ['tile roof repair', 'broken tile', 'broken tiles', 'cracked tile', 'clay tile', 'tile repair'], page: '/roofing-services/tile-roof-repair-tucson' },
    { service: 'Concrete Tile Roof Replacement', keywords: ['concrete tile'], page: '/roofing-services/concrete-tile-roof-replacement' },
    { service: 'Shingle Roof Replacement', keywords: ['shingle'], page: '/roofing-services/shingle-roof-replacement-tucson' },
    { service: 'Flat Roof Coating', keywords: ['flat roof', 'roof coating', 'elastomeric', 'recoat'], page: '/roofing-services/flat-roof-coating-tucson' },
    { service: 'Foam Roofing', keywords: ['foam', 'spf'], page: '/roofing-services/foam-roofing-tucson' },
    { service: 'Metal Roofing', keywords: ['metal roof', 'standing seam'], page: '/roofing-services/metal-roofing-tucson' },
    { service: 'Emergency Roof Repair', keywords: ['emergency', 'storm damage', 'storm'], page: '/roofing-services/emergency-roof-repair-tucson' },
    { service: 'Roof Inspection', keywords: ['inspection', 'inspect'], page: '/roofing-services/roof-inspection' },
    { service: 'Roof Replacement', keywords: ['replacement', 'new roof', 'tear off', 'tear-off', 'reroof', 're-roof', 'replaced the roof'], page: '/roofing-services/new-roof-tucson' },
    { service: 'Roof Repair', keywords: ['repair', 'leak', 'patch', 'seal'], page: '/roofing-services/roof-repair-tucson' },
  ],
  defaultServicePage: '/roofing-services',
  // City/area -> approximate center coords + real Sunrise location page.
  serviceAreas: [
    { city: 'Oro Valley', lat: 32.3909, lng: -110.9665, page: '/oro-valley-roofing' },
    { city: 'Marana', lat: 32.4367, lng: -111.2235, page: '/marana-roofing' },
    { city: 'Catalina Foothills', lat: 32.2992, lng: -110.9212, page: '/catalina-foothills-roofing' },
    { city: 'Green Valley', lat: 31.8543, lng: -110.9943, page: '/green-valley-roofing' },
    { city: 'Sahuarita', lat: 31.9573, lng: -110.9559, page: '/sahuarita-roofing' },
    { city: 'Vail', lat: 32.0481, lng: -110.7126, page: '/vail-roofing' },
    { city: 'Rita Ranch', lat: 32.1153, lng: -110.7826, page: '/rita-ranch-roofing' },
    { city: 'Tucson', lat: 32.2226, lng: -110.9747, page: '/tucson-roofing-services' },
  ],
  defaultArea: { city: 'Tucson', lat: 32.2226, lng: -110.9747, page: '/tucson-roofing-services' },
};

/** GBP API target IDs — filled in Vercel env after OAuth + /api/gbp-accounts. */
export function gbpTarget() {
  return {
    accountId: process.env.GBP_ACCOUNT_ID || null, // e.g. "accounts/123..."
    locationId: process.env.GBP_LOCATION_ID || null, // e.g. "locations/456..."
  };
}
