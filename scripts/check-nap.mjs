#!/usr/bin/env node
// Fails if the repo drifts from seo/nap.json. Run before any citation push.
//   node scripts/check-nap.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const nap = JSON.parse(readFileSync("seo/nap.json", "utf8"));

// nap.hours is the canonical "Mo-Fr 06:00-18:00, Sa 08:00-16:00".
const HOURS = nap.hours.match(/\d{2}:\d{2}-\d{2}:\d{2}/g) ?? [];
const OPENS = new Set(HOURS.map((h) => h.split("-")[0]));
const WEEKDAY_OPEN_H = Number(HOURS[0].split(":")[0]);

const SCAN_EXT = new Set([".html", ".js", ".jsx", ".json", ".txt", ".md"]);
// roofing-services/ is the pre-2025 URL scheme: every page 301s (vercel.json), never served.
const SKIP_DIR = new Set(["node_modules", ".git", "backups", ".vercel", "dist", "roofing-services"]);

// Legitimate exceptions: file substring -> variant it may contain.
const ALLOW = [
  // Web3Forms still delivers to the Outlook inbox; the comment must stay truthful.
  { file: "sunrise/components/contact.", variant: "sunriseroofer@outlook.com" },
  // Greyed-out example in the phone input, never presented as the business number.
  { file: "sunrise/components/contact.", variant: "(520) 555-0123" },
  // Same placeholder in the hero's compact estimate form.
  { file: "sunrise/components/hero.", variant: "(520) 555-0123" },
  { file: "seo/nap.json", variant: "*" },
  // One-way mirror of live Google Business Profile post copy. The cron re-syncs
  // from Google, so editing it here just churns; fix the post ON Google instead.
  // Served with X-Robots-Tag: noindex, so it carries no SEO weight.
  { file: "data/gbp/posts.json", variant: "Sunrise Roofing" },
  // Generated pack quotes the forbidden numbers inside its own warning text.
  { file: "seo/citation-paste.txt", variant: "*" },
  { file: "seo/citations.md", variant: "*" },
  { file: "scripts/check-nap.mjs", variant: "*" },
];
const allowed = (f, v) =>
  ALLOW.some((a) => f.split(String.fromCharCode(92)).join("/").includes(a.file) && (a.variant === "*" || a.variant === v));

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIR.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (SCAN_EXT.has(extname(e))) yield p;
  }
}

const problems = [];
let scanned = 0;
for (const file of walk(".")) {
  scanned++;
  const txt = readFileSync(file, "utf8");
  for (const [variant, why] of Object.entries(nap.forbiddenVariants)) {
    if (variant.startsWith("_")) continue;
    if (txt.includes(variant) && !allowed(file, variant)) {
      const line = txt.slice(0, txt.indexOf(variant)).split("\n").length;
      problems.push(`${file}:${line}  forbidden "${variant}" — ${why}`);
    }
  }
  // Opening hours, in every spelling they get written in. The 2026-08-18 move
  // from 7am to 6am matched only the "7AM-6PM" form and the schema "opens"
  // values, so the contact card -- which writes the same hours compactly as
  // "Mon-Fri 7-6" -- kept showing 7 on the live site while this checker still
  // passed. Compare against nap.json instead of a banned-string list, so a
  // format nobody thought of is still caught.
  for (const m of txt.matchAll(/"opens"\s*:\s*"(\d{2}:\d{2})"/g)) {
    if (!OPENS.has(m[1])) {
      const line = txt.slice(0, m.index).split("\n").length;
      problems.push(`${file}:${line}  schema opens "${m[1]}" — nap.json allows ${[...OPENS].join(", ")}`);
    }
  }
  // "Mon-Fri 6AM-6PM", "Mon-Fri 6-6", "Mon–Fri: 6 – 6" and friends. The dash
  // class covers hyphen plus the U+2010..U+2015 dashes the copy actually uses.
  const weekday = /\bMon(?:day)?\s*[‐-―-]\s*Fri(?:day)?\s*:?\s*(\d{1,2})\s*(?:AM|A\.M\.)?\s*[‐-―-]\s*(\d{1,2})/gi;
  for (const m of txt.matchAll(weekday)) {
    if (Number(m[1]) !== WEEKDAY_OPEN_H) {
      const line = txt.slice(0, m.index).split("\n").length;
      problems.push(`${file}:${line}  weekday hours "${m[0].trim()}" opens at ${m[1]} — nap.json says ${WEEKDAY_OPEN_H}`);
    }
  }

  // Eddie's direct line is allowed only where swap.js replaces it: visible
  // text and tel: links on pages that load the snippet. Anywhere a crawler, a
  // share card, a directory or an AI reads it raw, a call to it is invisible
  // to CallRail, so it must be the listing number (nap.phone) instead.
  if (!allowed(file, nap.phone.swapTarget)) {
    const [, a3, b3, c4] = nap.phone.swapTarget.match(/(\d{3})\D*(\d{3})\D*(\d{4})/);
    const directRe = new RegExp(`\\(?${a3}\\)?[ .-]?${b3}[ .-]?${c4}`);
    const rawZones = [
      ...txt.matchAll(/<meta\b[^>]*>/g),
      ...txt.matchAll(/<title>[\s\S]*?<\/title>/g),
      ...txt.matchAll(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/g),
    ];
    for (const z of rawZones) {
      if (directRe.test(z[0])) {
        const line = txt.slice(0, z.index).split("\n").length;
        problems.push(`${file}:${line}  direct line in a meta/title/JSON-LD block — swap.js can't reach it; use ${nap.phone.dashed}`);
      }
    }
    if (/(llms|citation-paste)\.txt$/.test(file) && directRe.test(txt)) {
      problems.push(`${file}  direct line in a file read raw by AIs / directories; use ${nap.phone.dashed}`);
    }
    if (/\.html$/.test(file) && directRe.test(txt) && !/cdn\.callrail\.com\/companies\//.test(txt)) {
      problems.push(`${file}  shows the direct line but has no CallRail swap.js`);
    }
  }

  // An address fragment must never appear without its suite.
  const bare = /7320 N La Cholla Blvd(?! Ste 154-276)/.exec(txt);
  if (bare) {
    const line = txt.slice(0, bare.index).split("\n").length;
    problems.push(`${file}:${line}  address missing suite — must be "${nap.address.street}"`);
  }
}

console.log(`scanned ${scanned} files against seo/nap.json`);
if (problems.length) {
  console.error(`\nNAP DRIFT (${problems.length}):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("NAP consistent — no drift found.");
