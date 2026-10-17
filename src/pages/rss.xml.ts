import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { site } from "../lib/site";
import { postUrl } from "../lib/blog";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.name} blog`,
    description: "Trail reports from the Stevens Visualization Lab.",
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.lede, link: postUrl(p) })),
  });
}
