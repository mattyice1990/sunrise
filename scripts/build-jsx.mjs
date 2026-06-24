/* build-jsx.mjs — precompile the React components from JSX to plain JS.
 *
 * The site loads precompiled `.js` (no in-browser Babel) for fast loads. After
 * editing any `sunrise/**​/*.jsx`, regenerate the `.js` files with:
 *
 *     npm i -D @babel/standalone     # one-time, if not already installed
 *     node scripts/build-jsx.mjs
 *
 * Each file is transformed with the CLASSIC React runtime (React.createElement,
 * uses the global `React`) and wrapped in an IIFE so every file keeps its own
 * scope — exactly like the old `<script type="text/babel">` tags did. Components
 * are shared across files via `window` (Object.assign(window, {...})), so the
 * IIFE wrapper must stay. Commit BOTH the edited `.jsx` and the regenerated `.js`.
 */
import babel from "@babel/standalone";
import { readFileSync, writeFileSync } from "node:fs";

const FILES = [
  "components/icons", "components/nav", "components/hero", "components/services",
  "components/about", "components/owner", "components/portfolio", "components/property",
  "components/social", "components/reviews", "components/contact", "components/servicearea",
  "components/app", "components/projects-app", "components/projects-page", "components/chat",
  "seo/seo-page",
];

const base = new URL("../sunrise/", import.meta.url);
for (const rel of FILES) {
  const code = readFileSync(new URL(rel + ".jsx", base), "utf8");
  const compiled = babel.transform(code, {
    presets: [["react", { runtime: "classic" }]],
    comments: true,
  }).code;
  writeFileSync(new URL(rel + ".js", base), "(function(){\n" + compiled + "\n})();\n");
  console.log("built " + rel + ".js");
}
console.log("Done — " + FILES.length + " files compiled.");
