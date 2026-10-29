/** Site-wide data: copy from about.yaml, addresses from links.yaml, paper tags from paper-tags.yaml, and lookup helpers. */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getCollection, type CollectionEntry } from "astro:content";
import { parse } from "yaml";
import aboutYaml from "../data/about.yaml?raw";
import linksYaml from "../data/links.yaml?raw";
import tagsYaml from "../data/paper-tags.yaml?raw";
import themesYaml from "../data/research-themes.yaml?raw";

export interface Social {
  name: string;
  icon: "github" | "youtube" | "linkedin" | "bluesky" | "x";
  url: string;
  handle: string;
}

export interface Site {
  name: string;
  shortName: string;
  url: string;
  email: string;
  googleSiteVerification?: string;
  mission: string;
  announcement: { show: boolean; text: string; link?: string; linkText?: string };
  whatWeDo: string[];
  values: { title: string; text: string }[];
  location: { building: string; street: string; city: string; coords: string };
  github: string;
  editBase: string;
  socials: Social[];
  institution: { name: string; url: string; school: string; schoolUrl: string };
}

/** about.yaml and links.yaml, merged. */
export const site = { ...parse(aboutYaml), ...parse(linksYaml) } as Site;

type TagGroup = Record<string, { label: string; logo?: string; papers: string[] }>;
/** paper-tags.yaml: each tag's label (and logo, for partners) plus the papers it applies to. */
export const tags = parse(tagsYaml) as { domains: TagGroup; methods: TagGroup; partners: TagGroup };

/** Tag key → display label (or label + logo for partners). */
export const vocab = {
  domains: Object.fromEntries(Object.entries(tags.domains).map(([k, t]) => [k, t.label])),
  methods: Object.fromEntries(Object.entries(tags.methods).map(([k, t]) => [k, t.label])),
  orgs: Object.fromEntries(Object.entries(tags.partners).map(([k, t]) => [k, { name: t.label, logo: t.logo }])),
} as {
  domains: Record<string, string>;
  methods: Record<string, string>;
  orgs: Record<string, { name: string; logo?: string }>;
};

/** The theme color palette (name → hex) from research-themes.yaml. */
export const themePalette = (parse(themesYaml) as { palette: Record<string, string> }).palette;

/** A lighter version of a palette color for dark mode: same hue and saturation, fixed lightness. */
function lighten(hex: string, lightness = 0.66): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  const c = (1 - Math.abs(2 * lightness - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = lightness - c / 2;
  const [r1, g1, b1] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h) % 6];
  return "#" + [r1, g1, b1].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
}

/** CSS custom properties for the palette (--forest, --clay, …), with dark-mode versions. */
export const paletteCss = (() => {
  const light = Object.entries(themePalette).map(([k, v]) => `--${k}:${v}`).join(";");
  const dark = Object.entries(themePalette).map(([k, v]) => `--${k}:${lighten(v)}`).join(";");
  return `:root{${light}}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){${dark}}}:root[data-theme="dark"]{${dark}}`;
})();

type PaperEntry = CollectionEntry<"papers">;
/** A paper with its tags from paper-tags.yaml attached. */
export type Paper = Omit<PaperEntry, "data"> & {
  data: Omit<PaperEntry["data"], "domains" | "methods" | "partners"> & { domains: string[]; methods: string[]; partners: string[] };
};
export type Theme = CollectionEntry<"themes">;
export type Person = CollectionEntry<"people">;

/** Papers newest first (year, then month); ties broken by type then title. */
export async function getPapers(): Promise<Paper[]> {
  const entries = await getCollection("papers");
  const slugs = new Set(entries.map((p) => p.id));
  for (const [group, list] of Object.entries(tags))
    for (const [key, tag] of Object.entries(list))
      for (const slug of tag.papers ?? [])
        if (!slugs.has(slug)) throw new Error(`paper-tags.yaml: ${group} → ${key} lists unknown paper "${slug}"`);
  const tagged = (group: TagGroup, slug: string) => Object.keys(group).filter((k) => (group[k].papers ?? []).includes(slug));
  const papers: Paper[] = entries.map((p) => ({
    ...p,
    data: { ...p.data, domains: tagged(tags.domains, p.id), methods: tagged(tags.methods, p.id), partners: tagged(tags.partners, p.id) },
  }));
  const typeRank = { journal: 0, conference: 1, thesis: 2, workshop: 3, poster: 4 } as const;
  const sorted = papers.sort(
    (a, b) =>
      b.data.year - a.data.year ||
      (b.data.month ?? 0) - (a.data.month ?? 0) ||
      typeRank[a.data.type] - typeRank[b.data.type] ||
      a.data.short.localeCompare(b.data.short),
  );
  // Fail the build on dangling references, the same way the schemas do.
  const ids = new Set(sorted.map((p) => p.id));
  for (const p of sorted)
    for (const ref of p.data.builds_on)
      if (!ids.has(ref)) throw new Error(`papers/${p.id}.md: builds_on "${ref}" is not a paper slug`);
  return sorted;
}

const publicDir = join(process.cwd(), "public");

/**
 * URL of a paper's teaser: `teaser:` from its frontmatter, else teaser.png/.jpg/.jpeg/.webp,
 * all inside public/papers/<slug>/. Undefined when there is none (a contour tile is shown).
 */
export function teaserUrl(paper: Paper): string | undefined {
  const names = paper.data.teaser ? [paper.data.teaser] : ["teaser.png", "teaser.jpg", "teaser.jpeg", "teaser.webp"];
  const found = names.find((n) => existsSync(join(publicDir, "papers", paper.id, n)));
  if (paper.data.teaser && !found) throw new Error(`papers/${paper.id}.md: teaser "${paper.data.teaser}" not found in public/papers/${paper.id}/`);
  return found && `/papers/${paper.id}/${found}`;
}

/**
 * URL of a paper's mini teaser (teaser-mini.png/.jpg/.jpeg/.webp in the same folder), the small
 * version used on paper cards and lists. Falls back to the full teaser when there is no mini.
 */
export function teaserMiniUrl(paper: Paper): string | undefined {
  const found = ["teaser-mini.png", "teaser-mini.jpg", "teaser-mini.jpeg", "teaser-mini.webp"].find((n) =>
    existsSync(join(publicDir, "papers", paper.id, n)),
  );
  return found ? `/papers/${paper.id}/${found}` : teaserUrl(paper);
}

/**
 * Share-card image for a paper: scripts/optimize-images.mjs builds a 1200×630
 * og.jpg from its teaser after each build. Papers without a teaser use the
 * site's default card (undefined here).
 */
export const ogImageUrl = (paper: Paper): string | undefined => (teaserUrl(paper) ? `/papers/${paper.id}/og.jpg` : undefined);

/** Plain-text excerpt of Markdown (link text kept, formatting dropped), cut at a word boundary. */
export function excerpt(markdown: string, max = 155): string {
  const text = markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/** URL of an image in a public/ folder (e.g. people photos); fails the build if the file is missing. */
export function publicFile(folder: string, file: string | undefined, where: string): string | undefined {
  if (!file) return undefined;
  if (!existsSync(join(publicDir, folder, file))) throw new Error(`${where}: "${file}" not found in public/${folder}/`);
  return `/${folder}/${file}`;
}

/** Looks up the optional `paper:` reference on a news, press, or blog entry; fails the build on a bad slug. */
export async function getLinkedPaper(slug: string | undefined, where: string): Promise<Paper | undefined> {
  if (!slug) return undefined;
  const paper = (await getPapers()).find((p) => p.id === slug);
  if (!paper) throw new Error(`${where}: paper "${slug}" is not a paper slug`);
  return paper;
}

export async function getThemes(): Promise<Theme[]> {
  const themes = (await getCollection("themes")).sort((a, b) => a.data.order - b.data.order);
  const papers = new Set((await getCollection("papers")).map((p) => p.id));
  for (const t of themes)
    for (const slug of t.data.selected)
      if (!papers.has(slug)) throw new Error(`research-themes.yaml: ${t.id} selects unknown paper "${slug}"`);
  return themes; // research-themes.yaml order is display order
}

const GROUPS = ["faculty", "core", "visiting", "alumni", "pet"];
const DEGREES = ["postdoc", "phd", "ms", "undergrad"];

/**
 * Sort order for people: by group (it decides the page section, faculty first within the members),
 * then by degree level (postdoc, PhD, master's, undergraduate), then alphabetical.
 */
export const comparePeople = (a: Person, b: Person): number =>
  GROUPS.indexOf(a.data.group) - GROUPS.indexOf(b.data.group) ||
  DEGREES.indexOf(a.data.degree ?? "") - DEGREES.indexOf(b.data.degree ?? "") ||
  a.data.name.localeCompare(b.data.name);

/** Lab members keyed by full name, used to link and underline authors. */
export async function getPeopleByName(): Promise<Map<string, Person>> {
  const people = await getCollection("people");
  return new Map(people.map((p) => [p.data.name, p]));
}

export const themeColor = (color: string) => `var(--${color})`;

export const formatMonth = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export const formatDay = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The lab's name as HTML, with "Visualization" / "VIS" in Stevens red (styled by `.vis` in global.css). */
export const brandHtml = (s: string) => escapeHtml(s).replace(/\b(Visualization|VIS)\b/, '<span class="vis">$1</span>');

/** Minimal inline Markdown for YAML copy: **bold**, *italic*, and [links](url). */
export function inlineMd(src: string): string {
  return escapeHtml(src)
    .replace(/Stevens Visualization Lab/g, 'Stevens <span class="vis">Visualization</span> Lab')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const external = /^https?:/.test(href);
      return `<a href="${href}"${external ? ' rel="noopener"' : ""}>${text}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/** Last build date, shown in the footer map label. */
export const builtOn = new Date();
