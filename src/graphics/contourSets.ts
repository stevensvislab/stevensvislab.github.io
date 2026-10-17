/**
 * The contour textures used on the site. Each one is built once as a small,
 * cacheable SVG file at /contours/<key>.svg (see pages/contours/[key].svg.ts)
 * instead of being drawn into every page's HTML.
 *
 * Textures that repeat per item (paper tiles, lab-member placeholders, the
 * page-top texture) come from fixed pools, so the set of files stays small and
 * known. Contours.astro refuses a texture that isn't listed here.
 */

export interface ContourSpec {
  width: number;
  height: number;
  seed: number;
  levels: number;
  frequency: number;
}

export const DEFAULT_FREQUENCY = 0.0035;

/** File name for a texture, e.g. "1600x420-s23-l11-f35". */
export const specKey = (s: ContourSpec) => `${s.width}x${s.height}-s${s.seed}-l${s.levels}-f${Math.round(s.frequency * 10000)}`;

const hash = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100003, 7);

// One-off textures.
export const FOOTER: ContourSpec = { width: 1600, height: 420, seed: 23, levels: 11, frequency: DEFAULT_FREQUENCY };
export const HERO: ContourSpec = { width: 1600, height: 520, seed: 7, levels: 16, frequency: DEFAULT_FREQUENCY };
export const ABOUT: ContourSpec = { width: 1600, height: 360, seed: 19, levels: 12, frequency: DEFAULT_FREQUENCY };
export const LOST: ContourSpec = { width: 1400, height: 700, seed: 404, levels: 10, frequency: DEFAULT_FREQUENCY };
export const JOIN_CARD: ContourSpec = { width: 300, height: 300, seed: 42, levels: 10, frequency: 0.012 };

// Pools: an id (page path, paper slug, person id) always picks the same member.
const TOP_POOL = 4;
const PERSON_POOL = 12;
const TILE_POOL = 24;

/** Texture behind the top of a page, chosen by its path. */
export const topSpec = (path: string): ContourSpec => ({ width: 1600, height: 420, seed: 31 + (hash(path) % TOP_POOL), levels: 13, frequency: DEFAULT_FREQUENCY });
/** Placeholder photo for a person without one (People page). */
export const personSpec = (id: string): ContourSpec => ({ width: 300, height: 300, seed: 100 + (hash(id) % PERSON_POOL), levels: 10, frequency: 0.012 });
/** Same, for the small round avatars in the home-page People summary. */
export const avatarSpec = (id: string): ContourSpec => ({ width: 128, height: 128, seed: 100 + (hash(id) % PERSON_POOL), levels: 8, frequency: 0.03 });
/** Contour tile for a paper without a teaser image. */
export const tileSpec = (id: string): ContourSpec => ({ width: 480, height: 260, seed: 200 + (hash(id) % TILE_POOL), levels: 9, frequency: 0.006 });

/** Every texture the site can use, for building the files. */
export function allSpecs(): ContourSpec[] {
  const specs = [FOOTER, HERO, ABOUT, LOST, JOIN_CARD];
  for (let i = 0; i < TOP_POOL; i++) specs.push({ width: 1600, height: 420, seed: 31 + i, levels: 13, frequency: DEFAULT_FREQUENCY });
  for (let i = 0; i < PERSON_POOL; i++) {
    specs.push({ width: 300, height: 300, seed: 100 + i, levels: 10, frequency: 0.012 });
    specs.push({ width: 128, height: 128, seed: 100 + i, levels: 8, frequency: 0.03 });
  }
  for (let i = 0; i < TILE_POOL; i++) specs.push({ width: 480, height: 260, seed: 200 + i, levels: 9, frequency: 0.006 });
  return specs;
}

const known = new Set(allSpecs().map(specKey));
export const isKnownSpec = (s: ContourSpec) => known.has(specKey(s));
