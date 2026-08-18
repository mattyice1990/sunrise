#!/usr/bin/env node
// Fails if the repo drifts from seo/nap.json. Run before any citation push.
//   node scripts/check-nap.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const nap = JSON.parse(readFileSync("seo/nap.json", "utf8"));
const SCAN_EXT = new Set([".html", ".js", ".jsx", ".json", ".txt", ".md"]);
const SKIP_DIR = new Set(["node_modules", ".git", "backups", ".vercel", "dist"]);

// Legitimate exceptions: file substring -> variant it may contain.
const ALLOW = [
  // Web3Forms still delivers to the Outlook inbox; the comment must stay truthful.
  { file: "sunrise/components/contact.", variant: "sunriseroofer@outlook.com" },
  // Greyed-out example in the phone input, never presented as the business number.
  { file: "sunrise/components/contact.", variant: "(520) 555-0123" },
  { file: "seo/nap.json", variant: "*" },
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
