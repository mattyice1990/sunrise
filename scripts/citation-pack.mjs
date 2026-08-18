#!/usr/bin/env node
// Generates the copy-paste block used when filling in a directory listing.
// Everything comes from seo/nap.json so listings can never drift from the site.
//   node scripts/citation-pack.mjs        -> prints
//   node scripts/citation-pack.mjs --write -> writes seo/citation-paste.txt
import { readFileSync, writeFileSync } from "node:fs";

const n = JSON.parse(readFileSync("seo/nap.json", "utf8"));
const a = n.address;
const rows = [
  ["Business name", n.name],
  ["Address line 1", a.street],
  ["City", a.city],
  ["State", a.state],
  ["ZIP", a.postalCode],
  ["Full address", a.oneLine],
  ["Phone", n.phone.display],
  ["Phone (digits)", n.phone.dashed],
  ["Email", n.email],
  ["Website", n.website],
  ["License", n.license],
  ["Year established", n.foundingDate],
  ["Hours", n.hours],
  ["Primary category", n.categories.primary],
  ["Other categories", n.categories.secondary.join(", ")],
  ["Service areas", n.serviceAreas.join(", ")],
  ["Owners", n.owners.join(" & ")],
];
const pad = Math.max(...rows.map((r) => r[0].length));
let out = "SUNRISE ROOFERS LLC - CITATION PASTE PACK\n";
out += "Generated from seo/nap.json. Do not edit by hand.\n";
out += "=".repeat(64) + "\n\n";
for (const [k, v] of rows) out += k.padEnd(pad) + " : " + v + "\n";
out += "\nSHORT DESCRIPTION (" + n.descriptions.short.length + " chars)\n" + n.descriptions.short + "\n";
out += "\nLONG DESCRIPTION (" + n.descriptions.medium.length + " chars)\n" + n.descriptions.medium + "\n";
out += "\nEXISTING PROFILES (link these as 'social' / 'other' wherever a field exists)\n";
for (const [k, v] of Object.entries(n.profiles)) out += "  " + k.padEnd(10) + " " + v + "\n";
out += "\nRULES\n";
out += "  - Paste the address EXACTLY as above. No comma before 'Ste'.\n";
out += "  - Never use 520-783-3976 (GBP-bound) or 520-210-5284 (ads-only) in a citation.\n";
out += "  - If a directory forces a different format, record it in seo/citations.md.\n";

if (process.argv.includes("--write")) {
  writeFileSync("seo/citation-paste.txt", out);
  console.log("wrote seo/citation-paste.txt");
} else console.log(out);
