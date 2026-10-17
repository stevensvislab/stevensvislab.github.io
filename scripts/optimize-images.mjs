// Runs after `astro build`. Raw images live in public/ so they're easy to find;
// this writes smaller WebP copies of them into dist/ for components/PublicImage.astro:
//   name-480.webp  (480px wide, for thumbnails)
//   name-960.webp  (960px wide, for medium views and phones)
//   name.webp      (up to 1600px wide, for large views)
// The originals stay in place as the fallback. Only teasers, people photos, and
// blog images are processed (demo folders and logos are left alone).
//
// It also builds each paper's share card, papers/<slug>/og.jpg (1200×630: the
// teaser centered on the site's paper color), used by Facebook, LinkedIn, Slack,
// X, and iMessage link previews. Papers without a teaser use /og/default.png.
import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { parse } from "yaml";

const dist = new URL("../dist/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const isImage = (f) => /\.(png|jpe?g)$/i.test(f);
const files = [];

// public/papers/<slug>/<image> (top level of each paper folder only)
const papersDir = join(dist, "papers");
if (existsSync(papersDir))
  for (const slug of readdirSync(papersDir)) {
    const dir = join(papersDir, slug);
    if (statSync(dir).isDirectory()) for (const f of readdirSync(dir)) if (isImage(f)) files.push(join(dir, f));
  }
for (const folder of ["people", "blog"]) {
  const dir = join(dist, folder);
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (isImage(f)) files.push(join(dir, f));
}

let saved = 0;
await Promise.all(
  files.map(async (file) => {
    const base = file.replace(/\.[^.]+$/, "");
    const before = statSync(file).size;
    await sharp(file).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${base}-480.webp`);
    await sharp(file).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${base}-960.webp`);
    await sharp(file).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${base}.webp`);
    saved += before - statSync(`${base}.webp`).size;
  }),
);
// Share cards
const papersSrc = new URL("../src/content/papers/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
let cards = 0;
for (const md of readdirSync(papersSrc).filter((f) => f.endsWith(".md"))) {
  const slug = md.replace(/\.md$/, "");
  const front = parse(readFileSync(join(papersSrc, md), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const dir = join(papersDir, slug);
  const teaser = [front.teaser, "teaser.png", "teaser.jpg", "teaser.jpeg", "teaser.webp"].filter(Boolean).find((n) => existsSync(join(dir, n)));
  if (!teaser) continue;
  const art = await sharp(join(dir, teaser)).resize({ width: 1120, height: 550, fit: "inside" }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#f7f4ec" } })
    .composite([{ input: art, gravity: "centre" }])
    .jpeg({ quality: 86 })
    .toFile(join(dir, "og.jpg"));
  cards++;
}

console.log(`✓ Built ${cards} share cards.`);
console.log(`✓ Optimized ${files.length} images (large copies ${(saved / 1e6).toFixed(1)} MB smaller than the originals).`);
