/**
 * Layout for the Research Map: each theme is a region of terrain, each paper a
 * landmark placed by year, and `builds_on` links become dashed trails. Pure
 * layout math; ResearchMap.astro turns it into SVG.
 */
import { curveBasisClosed, curveCatmullRom, line } from "d3-shape";
import { makeNoise } from "../lib/random";
import type { Paper, Theme } from "../lib/site";

export interface Landmark {
  paper: Paper;
  x: number;
  y: number;
  color: string;
  award: boolean;
  labelBelow: boolean;
}

export interface Region {
  theme: Theme;
  d: string;
  y: number;
  labelX: number;
}

export function layoutMap(themes: Theme[], papers: Paper[], width = 960, laneHeight = 128) {
  const margin = { top: 64, right: 28, bottom: 20, left: 28 };
  const band = 46; // half-height of each region
  const themed = papers.filter((p) => p.data.themes.length > 0);
  const years = themed.map((p) => p.data.year);
  const y0 = Math.min(...years), y1 = Math.max(...years);
  const span = Math.max(1, y1 - y0);
  const innerW = width - margin.left - margin.right;
  // Years without papers get a narrower column (a gentle broken axis), so
  // busy years have room for their landmarks.
  const busy = new Set(years);
  const weight = (y: number) => (busy.has(y) ? 1 : 0.4);
  const stops: number[] = [0];
  for (let y = y0; y < y1; y++) stops.push(stops[stops.length - 1] + (weight(y) + weight(y + 1)) / 2);
  const total = stops[stops.length - 1] || 1;
  const xOf = (year: number) => margin.left + 80 + (stops[year - y0] / total) * (innerW - 170);
  const height = margin.top + themes.length * laneHeight + margin.bottom;
  const laneY = (i: number) => margin.top + laneHeight * (i + 0.5);
  const noise = makeNoise(11);

  // Regions: a wobbly band per theme, like a territory on a hand-drawn map.
  const blob = line().curve(curveBasisClosed).digits(1);
  const regions: Region[] = themes.map((theme, i) => {
    const cy = laneY(i);
    const pts: [number, number][] = [];
    const n = 28;
    for (let k = 0; k <= n; k++) {
      const x = margin.left + (k / n) * innerW;
      pts.push([x, cy - band + (noise(k * 0.45, i * 3.1) - 0.5) * 16]);
    }
    for (let k = n; k >= 0; k--) {
      const x = margin.left + (k / n) * innerW;
      pts.push([x, cy + band + (noise(k * 0.45, i * 3.1 + 1.7) - 0.5) * 16]);
    }
    // The region's name sits like a map tab just above its band.
    return { theme, d: blob(pts) ?? "", y: cy - band - 6, labelX: margin.left + 10 };
  });

  // Landmarks: by primary theme lane and year; same-year papers fan out
  // sideways, and labels alternate above/below so neighbors never collide.
  const laneIndex = new Map(themes.map((t, i) => [t.id, i]));
  const slots = new Map<string, number>();
  const placed = themed.map((paper) => {
    const lanes = paper.data.themes.map((t) => laneIndex.get(t) ?? 0);
    const key = `${lanes[0]}:${paper.data.year}`;
    const slot = slots.get(key) ?? 0;
    slots.set(key, slot + 1);
    return { paper, lanes, slot };
  });
  const landmarks: Landmark[] = [];
  themes.forEach((theme, li) => {
    const inLane = placed
      .filter((p) => p.lanes[0] === li)
      .map((p) => {
        const sameYear = slots.get(`${li}:${p.paper.data.year}`) ?? 1;
        const offset = (p.slot - (sameYear - 1) / 2) * 62; // center the fan on the year
        return { ...p, x: xOf(p.paper.data.year) + offset };
      })
      .sort((a, b) => a.x - b.x);
    inLane.forEach((p, k) => {
      const y = p.lanes.length > 1 ? (laneY(p.lanes[0]) + laneY(p.lanes[1])) / 2 : laneY(li);
      const labelBelow = k % 2 === 1;
      landmarks.push({
        paper: p.paper,
        x: p.x,
        y: y + (labelBelow ? -8 : 10),
        color: `var(--${theme.data.color})`,
        award: Boolean(p.paper.data.award),
        labelBelow,
      });
    });
  });

  // Trails: gently curved dashed paths between related landmarks.
  const byId = new Map(landmarks.map((l) => [l.paper.id, l]));
  const curve = line().curve(curveCatmullRom.alpha(0.5)).digits(1);
  const trails = landmarks.flatMap((to) =>
    to.paper.data.builds_on
      .map((id) => byId.get(id))
      .filter((from): from is Landmark => Boolean(from))
      .map((from) => {
        const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2 - 26;
        return curve([[from.x, from.y], [mx, my], [to.x, to.y]]) ?? "";
      }),
  );

  const ticks = Array.from({ length: span + 1 }, (_, i) => ({ year: y0 + i, x: xOf(y0 + i) }));
  return { width, height, regions, landmarks, trails, ticks, top: margin.top };
}
