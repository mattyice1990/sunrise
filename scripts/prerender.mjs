/* prerender.mjs — build-time prerender of the real page copy into every shell.
 *
 *     node scripts/prerender.mjs            # rewrite the shells
 *     node scripts/prerender.mjs --check    # exit 1 if any shell would change (CI / idempotency)
 *     node scripts/prerender.mjs --stats    # print visible words / h1 / internal links per page
 *
 * WHY: the site is a client-rendered React SPA. Before this, every HTML shell
 * carried only a boot splash inside <div id="root"> (35 words, no H1, identical
 * on all pages) plus a <noscript> copy that non-rendering crawlers ignore. Now
 * each shell ships the full page content as plain, visible, semantic HTML
 * between <!-- prerender:start --> … <!-- prerender:end --> inside #root.
 * React 18's createRoot().render() clears #root on mount, so browsers see the
 * React page as before; crawlers (and the first ~1s paint) see real content.
 *
 * HOW: no hand-copied text. For each shell we execute, in a node:vm sandbox,
 * exactly the compiled sunrise/** scripts that shell loads (seo-links, data-*,
 * icons, nav, contact, seo-page.js — or the homepage components + app.js),
 * with a tiny fake React whose createElement builds a vnode tree, and a fake
 * ReactDOM that captures the root element. The tree is then serialised to
 * attribute-less semantic HTML (svg / forms / video / header chrome dropped).
 * So the prerender mirrors seo-page.jsx and the homepage components by
 * construction. Run it after editing sunrise/seo/data-*.js, any homepage
 * component, or seo-page.jsx (after `node scripts/build-jsx.mjs`).
 *
 * The script READS sunrise/** and WRITES only the *.html shells.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const STATS = args.has("--stats");

const START = "<!-- prerender:start -->";
const END = "<!-- prerender:end -->";

/* Links that must be in every shell's crawlable nav list (appended if absent). */
const NAV_REQUIRED = [
  { href: "/storm-damage-roof-repair-tucson", label: "Storm Damage Repair", after: "/emergency-roof-repair" },
  { href: "/recent-work", label: "Recent Work", after: "/portfolio" },
];

/* Components that are chrome, interactive, or live-data only — not content. */
const SKIP_COMPONENTS = new Set(["TopBar", "HeaderNav", "MobileMenu", "HeroForm", "GoogleReviews", "Chat"]);
/* Elements dropped with their subtree. */
const DROP_TAGS = new Set(["svg", "video", "iframe", "form", "input", "select", "textarea", "button", "label", "option",
  "script", "style", "template", "canvas", "noscript", "audio", "source", "picture"]);
/* Elements that get a newline after them so the output stays diffable. */
const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "ul", "ol", "section", "article", "header",
  "footer", "main", "nav", "aside", "div", "blockquote", "figure", "figcaption", "hr", "table", "tr"]);
const VOID_TAGS = new Set(["br", "hr", "img"]);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------------------------------------------------------- fake React */
const Fragment = Symbol.for("prerender.Fragment");
function createElement(type, props, ...kids) {
  const p = Object.assign({}, props || {});
  if (kids.length === 1) p.children = kids[0];
  else if (kids.length > 1) p.children = kids;
  return { __v: true, type, props: p };
}
const React = {
  Fragment,
  createElement,
  useState: (i) => [typeof i === "function" ? i() : i, () => {}],
  useEffect: () => {},
  useLayoutEffect: () => {},
  useRef: (v) => ({ current: v === undefined ? null : v }),
  useMemo: (f) => f(),
  useCallback: (f) => f,
  useContext: () => undefined,
  useReducer: (r, i) => [i, () => {}],
  useId: () => "pr",
  memo: (c) => c,
  forwardRef: (c) => (props) => c(props, null),
};

function makeSandbox(globals) {
  const noop = () => {};
  const el = () => ({ setAttribute: noop, getAttribute: () => null, appendChild: noop, style: {}, classList: { add: noop, remove: noop, contains: () => false }, addEventListener: noop });
  const sb = {
    React,
    ReactDOM: { createRoot: () => ({ render: (node) => { sb.__rendered = node; } }) },
    console,
    document: {
      getElementById: () => el(), querySelector: () => null, querySelectorAll: () => [],
      createElement: el, head: el(), body: el(), documentElement: el(), addEventListener: noop, removeEventListener: noop,
      title: "", cookie: "", readyState: "complete",
    },
    navigator: { userAgent: "prerender", language: "en-US" },
    location: { href: "https://roofwithsunrise.com/", pathname: "/", search: "", hash: "", origin: "https://roofwithsunrise.com" },
    matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
    setTimeout: () => 0, clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
    requestAnimationFrame: () => 0, cancelAnimationFrame: noop,
    addEventListener: noop, removeEventListener: noop,
    fetch: () => new Promise(() => {}),
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    innerWidth: 1280, innerHeight: 800, scrollY: 0, devicePixelRatio: 1,
    URL, URLSearchParams, TextEncoder, TextDecoder,
  };
  Object.assign(sb, globals);
  sb.window = sb; sb.self = sb; sb.globalThis = sb;
  vm.createContext(sb);
  return sb;
}

/* ------------------------------------------------------------- vnode → HTML */
function renderChildren(children) {
  const flat = [];
  (function walk(c) {
    if (c === null || c === undefined || typeof c === "boolean") return;
    if (Array.isArray(c)) { c.forEach(walk); return; }
    flat.push(c);
  })(children);
  const parts = flat.map((c) => ({ html: render(c), el: !!(c && c.__v) })).filter((p) => p.html);
  let out = "", prev = null;
  for (const part of parts) {
    if (prev && (prev.el || part.el)) {
      const aEnd = prev.html.replace(/<[^>]*>/g, "");
      const bStart = part.html.replace(/<[^>]*>/g, "");
      if (aEnd && bStart && !/\s$/.test(aEnd) && !/^\s/.test(bStart) && !/^[,.;:!?)…]/.test(bStart)) out += " ";
    }
    out += part.html; prev = part;
  }
  return out;
}

function attrsFor(tag, props) {
  const a = [];
  const add = (k, v) => { if (v !== undefined && v !== null && v !== false && v !== "") a.push(` ${k}="${esc(v)}"`); };
  if (tag === "a") { add("href", props.href); add("rel", props.rel); add("target", props.target); add("title", props.title); }
  if (tag === "img") { add("src", props.src); a.push(` alt="${esc(props.alt || "")}"`); a.push(' decoding="async"'); }
  if (tag === "nav") add("aria-label", props["aria-label"]);
  return a.join("");
}

function render(node) {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return esc(node);
  if (Array.isArray(node)) return renderChildren(node);
  if (!node.__v) return "";
  const { type, props } = node;
  if (type === Fragment) return renderChildren(props.children);
  if (typeof type === "function") {
    if (SKIP_COMPONENTS.has(type.name)) return "";
    return render(type(props));
  }
  if (typeof type !== "string") return "";
  let tag = type.toLowerCase();
  if (tag === "image-slot") tag = "img"; // <Slot/> custom element → plain image
  if (DROP_TAGS.has(tag)) return "";
  if (props["aria-hidden"] === true || props["aria-hidden"] === "true") return "";
  if (VOID_TAGS.has(tag)) {
    if (tag === "img" && !props.src) return "";
    return `<${tag}${attrsFor(tag, props)}>` + (tag === "img" ? "" : "\n");
  }
  let inner = (props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html
    ? String(props.dangerouslySetInnerHTML.__html)
    : renderChildren(props.children)).trim(); // dropped <Icon/>s leave stray edge spaces
  // prune elements that carry no text and no image
  if (!/\S/.test(inner.replace(/<[^>]*>/g, "")) && !/<img\b/.test(inner)) return "";
  const html = `<${tag}${attrsFor(tag, props)}>${inner}</${tag}>`;
  return BLOCK_TAGS.has(tag) ? html + "\n" : html;
}

/* ------------------------------------------------------- shell manipulation */
function rootBounds(html) {
  const open = html.indexOf('<div id="root">');
  if (open < 0) throw new Error("no <div id=\"root\">");
  const innerStart = open + '<div id="root">'.length;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = innerStart;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return { innerStart, innerEnd: m.index };
  }
  throw new Error("unbalanced #root");
}

function existingNav(rootInner, sb) {
  const m = rootInner.match(/<nav class="boot__seo"[^>]*>([\s\S]*?)<\/nav>/);
  let links = [];
  if (m) {
    const re = /<a href="([^"]+)">([\s\S]*?)<\/a>/g;
    let a; while ((a = re.exec(m[1]))) links.push({ href: a[1], label: a[2] });
  } else {
    const S = sb.SUNRISE;
    links = [{ href: "/", label: "Home" }]
      .concat([...S.SERVICES, ...S.SEGMENTS, ...S.AREAS].map((p) => ({ href: S.url(p.slug), label: esc(p.t) })))
      .concat([{ href: "/about", label: "About Sunrise Roofers" }, { href: "/portfolio", label: "Roofing Projects" },
        { href: "/resources", label: "Resources" }, { href: "/blog", label: "Blog" }, { href: "/contact", label: "Contact" }]);
  }
  for (const req of NAV_REQUIRED) {
    if (links.some((l) => l.href === req.href)) continue;
    const i = links.findIndex((l) => l.href === req.after);
    const item = { href: req.href, label: esc(req.label) };
    if (i >= 0) links.splice(i + 1, 0, item); else links.push(item);
  }
  return '<nav class="boot__seo" aria-label="Roofing services and service areas">'
    + links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("") + "</nav>";
}

function pageGlobals(html) {
  const g = {};
  const re = /window\.__(\w+)\s*=\s*"([^"]*)"/g;
  let m; while ((m = re.exec(html))) g["__" + m[1]] = m[2];
  return g;
}

function shellScripts(html) {
  const out = [];
  const re = /<script src="(sunrise\/[^"]+\.js)"><\/script>/g;
  let m; while ((m = re.exec(html))) out.push(m[1]);
  // Only scripts compiled from JSX are components; vanilla helpers such as
  // reveal.js touch the live DOM at load time and are not content.
  return out.filter((rel) => rel.startsWith("sunrise/seo/") || existsSync(path.join(ROOT, rel.replace(/\.js$/, ".jsx"))));
}

function renderShell(file, html) {
  const globals = pageGlobals(html);
  const sb = makeSandbox(globals);
  for (const rel of shellScripts(html)) {
    const code = readFileSync(path.join(ROOT, rel), "utf8");
    vm.runInContext(code, sb, { filename: rel });
  }
  if (!sb.__rendered) throw new Error(`${file}: nothing rendered (no ReactDOM.createRoot().render() reached)`);
  let body = render(sb.__rendered).trim();
  const h1s = (body.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new Error(`${file}: rendered ${h1s} <h1> elements, expected 1`);
  return { body, sb };
}

function buildBlock(body, nav) {
  return [
    START,
    '<div class="prerender">',
    '<p class="prerender__brand"><span class="prerender__mark">SUNRISE ROOFERS</span> <span class="prerender__tag">Tucson\'s Trusted Roofing Experts</span></p>',
    body,
    nav,
    "</div>",
    END,
  ].join("\n");
}

function processShell(file) {
  const abs = path.join(ROOT, file);
  const before = readFileSync(abs, "utf8");
  let html = before;
  const { innerStart, innerEnd } = rootBounds(html);
  const oldInner = html.slice(innerStart, innerEnd);
  const { body, sb } = renderShell(file, html);
  const nav = existingNav(oldInner, sb);
  const eol = /\r\n/.test(before) ? "\r\n" : "\n"; // match the shell's line endings
  const block = buildBlock(body, nav).replace(/\r?\n/g, eol);
  html = html.slice(0, innerStart) + block + html.slice(innerEnd);
  // The <noscript><article> copies are now redundant (and would be a stale duplicate).
  html = html.replace(/[ \t]*<noscript>\s*<article[\s\S]*?<\/article>\s*<\/noscript>[ \t]*\r?\n?/g, "");
  const h1Total = (html.replace(/<script[\s\S]*?<\/script>/g, "").match(/<h1[\s>]/g) || []).length;
  if (h1Total !== 1) throw new Error(`${file}: shell ends up with ${h1Total} <h1>, expected exactly 1`);
  if ((html.match(/id="root"/g) || []).length !== 1) throw new Error(`${file}: expected exactly one id="root"`);
  return { before, after: html };
}

/* --------------------------------------------------------------- stats */
function stats(html) {
  const text = html
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const noScript = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  const h1 = (noScript.match(/<h1[\s>]/g) || []).length;
  const links = (noScript.match(/<a\s[^>]*href="\/(?!\/)[^"]*"/g) || []).length;
  return { words, h1, links };
}

/* ---------------------------------------------------------------- main */
const shells = readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .filter((f) => f === "index.html" || /window\.__page\s*=\s*"/.test(readFileSync(path.join(ROOT, f), "utf8")))
  .sort((a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b)));

let changed = 0;
const rows = [];
for (const file of shells) {
  const { before, after } = processShell(file);
  if (STATS) {
    let base = before;
    try { base = execFileSync("git", ["show", `HEAD:${file}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch {}
    rows.push({ file, before: stats(base), after: stats(after) });
  }
  if (after !== before) {
    changed++;
    if (!CHECK) writeFileSync(abs(file), after);
    else console.log(`would change: ${file}`);
  }
}
function abs(f) { return path.join(ROOT, f); }

if (STATS) {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad("page", 40) + pad("words", 14) + pad("h1", 10) + "internal links");
  for (const r of rows) {
    console.log(pad(r.file, 40) + pad(`${r.before.words} -> ${r.after.words}`, 14) + pad(`${r.before.h1} -> ${r.after.h1}`, 10) + `${r.before.links} -> ${r.after.links}`);
  }
}
if (CHECK) {
  if (changed) { console.error(`prerender --check: ${changed} shell(s) out of date — run: npm run prerender`); process.exit(1); }
  console.log(`prerender --check: all ${shells.length} shells up to date.`);
} else {
  console.log(`prerendered ${shells.length} shells (${changed} changed).`);
}
