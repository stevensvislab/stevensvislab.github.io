// Runs after `astro build`. Writes dist/sitemap.xml: one <url> per built page, using each
// page's canonical URL. Pages marked noindex (the 404 page) and files without a canonical
// link (the paper demos in public/) are left out, so new pages are listed automatically.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const urls = new Set();
for (const file of walk(dist).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical) urls.add(canonical);
}

const sorted = [...urls].sort();
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted
    .map((u) => `<url><loc>${escape(u)}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
console.log(`✓ Wrote sitemap.xml (${sorted.length} pages).`);
