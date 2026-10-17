// Post-build check: every internal link and asset reference in dist/ must
// resolve to a built file.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const pages = walk(dist).filter(
  (f) =>
    f.endsWith(".html") &&
    !f.includes(`${join("papers", "vispile", "demo")}`) &&
    !f.includes(`${join("papers", "knowledgevis", "demo")}`),
);
const resolves = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!clean || clean === "/") return true;
  const target = join(dist, clean);
  return existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html")));
};

let broken = 0;
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith("//")) continue;
    if (!resolves(url)) {
      broken++;
      console.error(`✗ ${relative(dist, file)} → ${url}`);
    }
  }
}

if (broken) {
  console.error(`\nLink check failed: ${broken} broken link(s).`);
  process.exit(1);
}
console.log(`✓ Link check passed (${pages.length} pages).`);
