import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const SRC_DIR = "C:\\Example for Dalton\\Assets\\Blog\\matt-sarah-roof-review";
const DEST_DIR = "./assets/blog/matt-sarah-roof-review";
await fs.mkdir(DEST_DIR, { recursive: true });

// natural-sort the RoofTucson* files
const entries = (await fs.readdir(SRC_DIR))
  .filter(f => /^rooftucson/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

if (entries.length < 4) {
  console.warn("Expected at least 4 images named like RoofTucson*. Found:", entries.length);
}

const srcPaths = entries.map(f => path.join(SRC_DIR, f));
// Mapping (by order)
const targets = [
  "matt-sarah-roof-review-fascia-rot-eave-corner.webp",
  "matt-sarah-roof-review-shingle-aging-rooftop-unit.webp",
  "matt-sarah-roof-review-long-shot-utility-clearance.webp",
  "matt-sarah-roof-review-eave-edge-lift-drip-edge.webp"
];

const processWebp = async (src, destName) => {
  const outPath = path.join(DEST_DIR, destName);
  const buf = await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  await fs.writeFile(outPath, buf);
  return outPath;
};

// Convert the first four images per mapping
const outPaths = [];
for (let i = 0; i < Math.min(4, srcPaths.length); i++) {
  outPaths.push(await processWebp(srcPaths[i], targets[i]));
}

// Choose hero: prefer #2, else #3
const heroSrc = srcPaths[1] ?? srcPaths[2] ?? srcPaths[0];
const heroBase = "matt-sarah-roof-review-hero";
const hero1600 = path.join(DEST_DIR, `${heroBase}-1600w.webp`);
const hero800  = path.join(DEST_DIR, `${heroBase}-800w.webp`);
const heroOG   = path.join(DEST_DIR, `${heroBase}-1200x630.jpg`);

// Hero 1600/800 webp
await sharp(heroSrc).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(hero1600);
await sharp(heroSrc).rotate().resize({ width: 800,  withoutEnlargement: true }).webp({ quality: 82 }).toFile(hero800);

// OG 1200x630 jpg (cover fit)
await sharp(heroSrc).rotate().resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 86 }).toFile(heroOG);

// Log mapping
console.table([
  { src: path.basename(srcPaths[0] ?? ""), out: path.basename(targets[0]) },
  { src: path.basename(srcPaths[1] ?? ""), out: path.basename(targets[1]) },
  { src: path.basename(srcPaths[2] ?? ""), out: path.basename(targets[2]) },
  { src: path.basename(srcPaths[3] ?? ""), out: path.basename(targets[3]) },
  { src: path.basename(heroSrc ?? ""),     out: path.basename(`${heroBase}-*`) }
]);

console.log("\n✅ Image processing complete!");
console.log(`📁 Output directory: ${DEST_DIR}`);
console.log(`📸 Hero variants: ${heroBase}-800w.webp, ${heroBase}-1600w.webp, ${heroBase}-1200x630.jpg`);

