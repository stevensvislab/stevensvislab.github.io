import type { CollectionEntry } from "astro:content";

/** Blog posts live at /blog/YYYY/MM/DD/<slug>/ (file: src/content/blog/YYYY-MM-DD-<slug>.md). */
export function postParams(post: CollectionEntry<"blog">) {
  const d = post.data.date;
  const pad = (n: number) => String(n).padStart(2, "0");
  const slug = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return { path: `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${slug}` };
}

export const postUrl = (post: CollectionEntry<"blog">) => `/blog/${postParams(post).path}/`;
