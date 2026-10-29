/* sync-home-faq-ld.mjs — rewrite the FAQPage JSON-LD in index.html from the FAQ items in
 * sunrise/components/social.jsx, so the schema always matches what React renders.
 * Run after editing the homepage FAQ:  node scripts/sync-home-faq-ld.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "sunrise/components/social.jsx"), "utf8");

// { q: "…", a: "…" } objects whose q is a question (testimonials share the q:/a: shape but are not questions)
const itemRe = /\{\s*q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/gs;
const pairs = [];
for (const m of src.matchAll(itemRe)) {
  const q = JSON.parse('"' + m[1] + '"');
  const a = JSON.parse('"' + m[2] + '"');
  if (q.trim().endsWith("?")) pairs.push([q, a]);
}
if (pairs.length < 5) throw new Error("found only " + pairs.length + " FAQ items in social.jsx — refusing to write");

const file = join(root, "index.html");
let html = readFileSync(file, "utf8");
let count = 0;
html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, body) => {
  let data;
  try { data = JSON.parse(body); } catch { return whole; }
  if (data["@type"] !== "FAQPage") return whole;
  data.mainEntity = pairs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  }));
  count++;
  const eol = body.includes("\r\n") ? "\r\n" : "\n";
  return '<script type="application/ld+json">' + eol + JSON.stringify(data, null, 2).replace(/\n/g, eol) + eol + "</script>";
});
writeFileSync(file, html);
console.log(`FAQPage blocks rewritten: ${count}; questions: ${pairs.length}`);
for (const [q] of pairs) console.log(" -", q);
