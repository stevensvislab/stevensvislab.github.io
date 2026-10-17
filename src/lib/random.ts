/** Deterministic randomness so generated graphics are identical on every build. */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded 2D value noise summed over octaves (fractal Brownian motion), in [0, 1]. */
export function makeNoise(seed: number) {
  const size = 256;
  const rand = mulberry32(seed);
  const values = Float32Array.from({ length: size * size }, rand);
  const at = (x: number, y: number) => values[((y & (size - 1)) * size + (x & (size - 1))) | 0];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const value = (x: number, y: number) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
    const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };

  return (x: number, y: number, octaves = 4) => {
    let sum = 0, amp = 1, freq = 1, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += value(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  };
}
