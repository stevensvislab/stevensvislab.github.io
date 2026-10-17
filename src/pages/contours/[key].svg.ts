/**
 * The contour texture files (/contours/<key>.svg), one per entry in
 * graphics/contourSets.ts. The lines are black; Contours.astro uses the file as
 * a CSS mask, so the color comes from the page (and follows light/dark mode).
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { contourLines } from "../../graphics/contours";
import { allSpecs, specKey, type ContourSpec } from "../../graphics/contourSets";

export const getStaticPaths = (() => allSpecs().map((spec) => ({ params: { key: specKey(spec) }, props: { spec } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const s = props.spec as ContourSpec;
  const paths = contourLines({ ...s, cell: 14 })
    .map((l) => `<path${l.index ? ' class="i"' : ""} d="${l.d}"/>`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s.width} ${s.height}" preserveAspectRatio="xMidYMid slice">` +
    `<style>path{fill:none;stroke:#000;stroke-width:1;vector-effect:non-scaling-stroke}.i{stroke-width:1.8}</style>${paths}</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
