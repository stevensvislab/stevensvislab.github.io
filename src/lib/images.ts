/** Image dimensions for files in public/, read once at build time so <img> tags reserve their space. */
import { join } from "node:path";
import sharp from "sharp";

const cache = new Map<string, Promise<{ width: number; height: number } | undefined>>();

/** Size of a public/ image given its URL (e.g. "/papers/ongoal/teaser.png"); undefined if unreadable. */
export function imageSize(url: string) {
  if (!cache.has(url))
    cache.set(
      url,
      sharp(join(process.cwd(), "public", url))
        .metadata()
        .then((m) => (m.width && m.height ? { width: m.width, height: m.height } : undefined))
        .catch(() => undefined),
    );
  return cache.get(url)!;
}
