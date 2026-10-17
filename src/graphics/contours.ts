/**
 * Topographic contour lines from seeded noise, rendered to SVG path data at
 * build time. Isolines are a visualization technique in their own right, so
 * the site's "map" texture is literally a data vis.
 */
import { contours } from "d3-contour";
import { curveBasisClosed, line } from "d3-shape";
import { makeNoise } from "../lib/random";

export interface ContourOptions {
  width: number;
  height: number;
  seed?: number;
  /** Grid cell size in px; larger = smoother and smaller output. */
  cell?: number;
  /** Number of contour levels. */
  levels?: number;
  /** Noise frequency; smaller = broader hills. */
  frequency?: number;
}

export interface ContourLine {
  d: string;
  /** Every fourth line is an "index contour", drawn heavier like on a topo map. */
  index: boolean;
}

export function contourLines({
  width,
  height,
  seed = 7,
  cell = 12,
  levels = 14,
  frequency = 0.0035,
}: ContourOptions): ContourLine[] {
  // Pad the grid past the viewport so contour rings never trace the border.
  const pad = 3;
  const gw = Math.ceil(width / cell) + pad * 2;
  const gh = Math.ceil(height / cell) + pad * 2;
  const noise = makeNoise(seed);
  const values = new Array<number>(gw * gh);
  for (let j = 0; j < gh; j++)
    for (let i = 0; i < gw; i++) values[j * gw + i] = noise(i * cell * frequency, j * cell * frequency, 4);

  const lo = Math.min(...values), hi = Math.max(...values);
  const thresholds = Array.from({ length: levels }, (_, k) => lo + ((k + 1) * (hi - lo)) / (levels + 1));
  const rings = contours().size([gw, gh]).thresholds(thresholds)(values);
  const path = line().curve(curveBasisClosed).digits(1);

  return rings.map((mp, k) => ({
    index: k % 4 === 3,
    d: mp.coordinates
      .flatMap((polygon) => polygon.map((ring) => path(ring.map(([x, y]) => [(x - pad) * cell, (y - pad) * cell])) ?? ""))
      .join(""),
  }));
}
