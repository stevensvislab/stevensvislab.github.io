/**
 * Machine-readable publication list, so other sites (e.g. adamcoscia.com) can
 * reuse the lab's data instead of keeping a second copy.
 */
import type { APIContext } from "astro";
import { getPapers, getThemes, teaserUrl, vocab } from "../../lib/site";

export async function GET(context: APIContext) {
  const [papers, themes] = await Promise.all([getPapers(), getThemes()]);
  const themeName = new Map(themes.map((t) => [t.id, t.data.name]));
  const base = context.site!;
  const abs = (href?: string) => (href ? new URL(href, base).href : undefined);
  const body = papers.map((p) => ({
    id: p.id,
    title: p.data.title,
    short: p.data.short,
    authors: p.data.authors,
    venue: p.data.venue,
    venueFull: p.data.venueFull,
    year: p.data.year,
    month: p.data.month,
    type: p.data.type,
    themes: p.data.themes.map((t) => ({ id: t, name: themeName.get(t) })),
    domains: p.data.domains.map((d) => vocab.domains[d]),
    methods: p.data.methods.map((m) => vocab.methods[m]),
    award: p.data.award,
    url: new URL(`/papers/${p.id}/`, base).href,
    teaser: abs(teaserUrl(p)),
    links: Object.fromEntries(Object.entries(p.data.links).map(([k, v]) => [k, abs(v)])),
    bibtex: p.data.bibtex,
  }));
  return new Response(JSON.stringify(body, null, 2), { headers: { "Content-Type": "application/json" } });
}
