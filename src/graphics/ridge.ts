/**
 * An elevation-profile ridge whose peaks are papers per year: "the climb so
 * far." Drawn along the top edge of the footer and grows as the lab publishes.
 */
import { curveCatmullRom, line } from "d3-shape";
import { makeNoise } from "../lib/random";

export interface Peak {
  year: number;
  count: number;
  x: number;
  y: number;
}

export function ridge(counts: Map<number, number>, width: number, height: number, seed = 3) {
  const years = [...counts.keys()].sort((a, b) => a - b);
  const max = Math.max(1, ...counts.values());
  const noise = makeNoise(seed);
  const base = height; // ground line
  const step = width / (years.length + 1);
  const peakY = (n: number) => base - 14 - (n / max) * (height - 24);

  const peaks: Peak[] = years.map((year, i) => {
    const count = counts.get(year) ?? 0;
    return { year, count, x: step * (i + 1), y: peakY(count) };
  });

  // Peaks joined by saddles, with a little noise so it reads as terrain.
  const pts: [number, number][] = [[0, base - 10]];
  peaks.forEach((p, i) => {
    const prev = pts[pts.length - 1];
    const saddleX = (prev[0] + p.x) / 2;
    const saddleY = Math.max(prev[1], p.y) + 8 + noise(i * 1.7, 0.5) * 10;
    pts.push([saddleX - step * 0.12, Math.min(base - 4, saddleY - 4)]);
    pts.push([saddleX + step * 0.1, Math.min(base - 2, saddleY)]);
    pts.push([p.x, p.y]);
  });
  pts.push([width - step * 0.4, base - 12], [width, base - 8]);

  const crest = line().curve(curveCatmullRom.alpha(0.5)).digits(1)(pts) ?? "";
  const area = `${crest}L${width},${height}L0,${height}Z`;
  return { crest, area, peaks };
}
