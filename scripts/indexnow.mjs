#!/usr/bin/env node
// Pings IndexNow (Bing, Yandex, Naver, Seznam) so edited URLs get re-crawled in
// hours instead of waiting on an organic crawl. Google does NOT consume
// IndexNow -- for Google use Search Console "Validate fix" / "Request indexing".
//
//   node scripts/indexnow.mjs                      # dry run, every sitemap URL
//   node scripts/indexnow.mjs --since 2026-08-16   # only URLs modified on/after
//   node scripts/indexnow.mjs --url /roof-repair --url /tile-roofing
//   node scripts/indexnow.mjs --since 2026-08-16 --submit
//
// Dry run by default: this talks to third-party search engines, so the send is
// opt-in via --submit.
import { readFileSync, readdirSync } from "node:fs";

const HOST = "roofwithsunrise.com";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10000; // IndexNow per-request ceiling

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n) => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1]; };
const all = (n) => argv.reduce((a, v, i) => (v === n ? [...a, argv[i + 1]] : a), []);

// The key file must be reachable at the site root or engines reject the batch.
// IndexNow requires its contents to equal its own basename, which is also how we
// tell it apart from robots.txt/llms.txt/disavow.txt sitting alongside it.
const key = readdirSync(".")
  .filter((f) => /^[a-z0-9]{8,128}\.txt$/i.test(f))
  .map((f) => f.replace(/\.txt$/, ""))
  .find((k) => {
    try { return readFileSync(`${k}.txt`, "utf8").trim() === k; } catch { return false; }
  });
if (!key) {
  console.error("No IndexNow key file in the repo root. Expected <key>.txt containing exactly <key>.");
  process.exit(1);
}

// Explicit --url wins; otherwise pull from the sitemap, optionally date-filtered.
let urls = all("--url").filter(Boolean).map((u) => (u.startsWith("http") ? u : ORIGIN + (u.startsWith("/") ? u : "/" + u)));
if (!urls.length) {
  const xml = readFileSync("sitemap.xml", "utf8");
  const since = val("--since");
  urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({
      loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1],
      lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
    }))
    .filter((u) => u.loc && (!since || (u.lastmod && u.lastmod >= since)))
    .map((u) => u.loc);
}

if (!urls.length) {
  console.error("No URLs matched. Nothing to submit.");
  process.exit(1);
}
// Git Bash / MSYS rewrites a leading-slash argument into a Windows path, which
// would otherwise be submitted verbatim. Catch it instead of pinging garbage.
const malformed = urls.filter((u) => !/^https:\/\/[a-z0-9.-]+\/[\w\-./]*$/i.test(u));
if (malformed.length) {
  console.error("Refusing to submit malformed URLs:");
  malformed.forEach((u) => console.error("   " + u));
  console.error("On Git Bash pass the slug without a leading slash: --url roof-repair");
  process.exit(1);
}
if (urls.length > MAX_URLS) {
  console.error(`${urls.length} URLs exceeds the IndexNow per-request cap of ${MAX_URLS}.`);
  process.exit(1);
}

const body = { host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList: urls };

console.log(`key         ${key}`);
console.log(`keyLocation ${body.keyLocation}`);
console.log(`urls        ${urls.length}`);
urls.forEach((u) => console.log("   " + u));

if (!flag("--submit")) {
  console.log("\nDry run. Re-run with --submit to send.");
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
const text = await res.text().catch(() => "");
// 200 = accepted, 202 = accepted but key still being verified.
if (res.status === 200 || res.status === 202) {
  console.log(`\nSubmitted ${urls.length} URLs. HTTP ${res.status}${text ? " " + text : ""}`);
} else {
  console.error(`\nIndexNow rejected the batch. HTTP ${res.status} ${text}`);
  process.exit(1);
}
