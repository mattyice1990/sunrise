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
};

/** GBP API target IDs — filled in Vercel env after OAuth + /api/gbp-accounts. */
export function gbpTarget() {
  return {
    accountId: process.env.GBP_ACCOUNT_ID || null, // e.g. "accounts/123..."
    locationId: process.env.GBP_LOCATION_ID || null, // e.g. "locations/456..."
  };
}
