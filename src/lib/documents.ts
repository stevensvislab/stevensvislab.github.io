/** Helpers for the Markdown documents in src/content/documents/ (lab culture, prospectus). */
import { getEntry } from "astro:content";

/** The rendered HTML of a document (src/content/documents/<id>.md). */
export async function getDocument(id: string): Promise<{ title: string; html: string }> {
  const entry = await getEntry("documents", id);
  if (!entry) throw new Error(`src/content/documents/${id}.md not found`);
  return { title: entry.data.title, html: entry.rendered?.html ?? "" };
}

/** Moves every heading down `by` levels (## becomes ### for by = 1), so a document nests under its page's own headings. */
export function nestHeadings(html: string, by: number): string {
  const level = (n: string) => Math.min(6, Number(n) + by);
  return html
    .replace(/<h([1-6])(\s|>)/g, (_, n, end) => `<h${level(n)}${end}`)
    .replace(/<\/h([1-6])>/g, (_, n) => `</h${level(n)}>`);
}

/** The h2 and h3 headings of a document, for building an "On this page" list. */
export function outline(html: string): { depth: 2 | 3; id: string; text: string }[] {
  return [...html.matchAll(/<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    depth: Number(m[1]) as 2 | 3,
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ""),
  }));
}
