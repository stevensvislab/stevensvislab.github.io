/**
 * Content collections. Every data file is validated here, so a typo in a
 * paper, person, or theme fails the build with a readable message instead of
 * silently breaking a page. See README.md for how to add entries.
 */
import { readFileSync } from "node:fs";
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { parse } from "yaml";

const readYaml = (path: string) => parse(readFileSync(new URL(path, import.meta.url), "utf8"));

const themeIds = (readYaml("./data/themes.yaml") as { id: string }[]).map((t) => t.id) as [string, ...string[]];

// Domains, methods, and partners now live in tags.yaml; catch them if they're left in a paper.
const movedToTags = z.never({ error: "this now lives in src/data/tags.yaml (add the paper's slug to the tag there)" }).optional();

/**
 * YAML list → entries with ids (uses `id` if present, else the list position) and
 * an `order` field, since collections come back sorted by id rather than file order.
 */
const listParser = (text: string) =>
  (parse(text) ?? []).map((entry: Record<string, unknown>, i: number) => ({
    id: String(entry.id ?? String(i).padStart(3, "0")),
    ...entry,
    order: i,
  }));

const optionalUrl = z.string().min(1).optional();

const papers = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/papers" }),
  schema: () =>
    z.object({
      title: z.string(),
      short: z.string(),
      authors: z.array(z.string()).min(1),
      venue: z.string(), // short label, e.g. "CHI 2024"
      venueFull: z.string(), // full venue line shown in citations
      year: z.number().int(),
      month: z.number().int().min(1).max(12).optional(), // sorts papers within a year; only the year is shown
      type: z.enum(["journal", "conference", "workshop", "poster", "thesis"]),
      themes: z.array(z.enum(themeIds)).default([]),
      domains: movedToTags,
      methods: movedToTags,
      builds_on: z.array(z.string()).default([]),
      award: z.string().optional(),
      featured: z.boolean().default(false),
      partners: movedToTags,
      // File in public/papers/<slug>/. Leave out to use teaser.png (or .jpg/.webp) from that folder.
      teaser: z.string().optional(),
      teaserAlt: z.string().optional(),
      links: z
        .object({
          pdf: optionalUrl,
          doi: optionalUrl,
          project: optionalUrl,
          demo: optionalUrl,
          video: optionalUrl,
          talk: optionalUrl,
          slides: optionalUrl,
          poster: optionalUrl,
          code: optionalUrl,
          data: optionalUrl,
        })
        .default({}),
      bibtex: z.string().optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string(), // id from people.yaml
      lede: z.string(),
      image: z.string().optional(), // file in public/blog/
      imageAlt: z.string().optional(),
      paper: z.string().optional(), // slug of the paper a "trail report" is about
      draft: z.boolean().default(false),
    }),
});

const themes = defineCollection({
  loader: file("./src/data/themes.yaml", { parser: listParser }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    short: z.string(),
    color: z.enum(["forest", "lake", "ochre", "heather"]),
    description: z.string(),
    topics: z.array(z.string()),
    applications: z.array(z.string()),
    selected: z.array(z.string()), // paper slugs
  }),
});

const people = defineCollection({
  loader: file("./src/data/people.yaml"),
  schema: z.object({
    name: z.string(),
    first: z.string(),
    role: z.string(),
    group: z.enum(["faculty", "phd", "ms", "undergrad", "visiting", "alumni", "pet"]),
    photo: z.string().optional(), // file in public/people/
    interests: z.string().optional(),
    // Allowed links: site, email, scholar, github, linkedin, bluesky, x. Any other key fails the build.
    links: z
      .strictObject({
        site: optionalUrl,
        email: z.string().optional(),
        scholar: optionalUrl,
        github: optionalUrl,
        linkedin: optionalUrl,
        bluesky: optionalUrl,
        x: optionalUrl,
      })
      .default({}),
    start: z.number().int().optional(),
    end: z.number().int().optional(),
    now_at: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: file("./src/data/news.yaml", { parser: listParser }),
  schema: z.object({ date: z.coerce.date(), text: z.string(), paper: z.string().optional() }),
});

const press = defineCollection({
  loader: file("./src/data/press.yaml", { parser: listParser }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    outlet: z.string(),
    url: z.string(),
    papers: z.array(z.string()).default([]), // slugs of the papers the article covers
  }),
});

const courses = defineCollection({
  loader: file("./src/data/courses.yaml", { parser: listParser }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    type: z.enum(["lecture", "seminar", "lab"]),
    level: z.array(z.enum(["graduate", "senior undergraduate", "undergraduate", "special topics"])).min(1),
    terms: z.array(z.string()).min(1), // e.g. [Spring 2027, Spring 2028]
    description: z.string().optional(),
    url: optionalUrl,
  }),
});

const photos = defineCollection({
  loader: file("./src/data/photos.yaml", { parser: listParser }),
  schema: z.object({
    file: z.string(), // path under public/photos/
    caption: z.string(),
    alt: z.string(),
    date: z.coerce.date(),
  }),
});

const culture = defineCollection({
  loader: file("./src/data/culture.yaml", { parser: listParser }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    quote: z.object({ text: z.string(), by: z.string(), source: z.string() }),
    paragraphs: z.array(z.string()),
    notes: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  }),
});

const logoEntry = z.object({ name: z.string(), url: z.string(), logo: z.string().optional(), blurb: z.string().optional() });
const sponsors = defineCollection({ loader: file("./src/data/sponsors.yaml", { parser: listParser }), schema: logoEntry });
const partners = defineCollection({ loader: file("./src/data/partners.yaml", { parser: listParser }), schema: logoEntry });

export const collections = { papers, blog, themes, people, news, press, courses, photos, sponsors, partners, culture };
