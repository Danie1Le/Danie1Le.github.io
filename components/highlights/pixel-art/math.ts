/** A repeatable pseudo-random number in [0, 1) for a given seed. */
export const rnd = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

/** Smoothstep: 0 → 1 with a gentle start and finish. */
export const ease = (k: number) => k * k * (3 - 2 * k);

/** A Gaussian bump of width s, 1 at d = 0. */
export const gs = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));

/** A 3D vector scaled to length 1. */
export const unit = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return v.map((c) => c / l); };

/** An angle brought into (-π, π], so easing between two angles takes the short way round. */
export const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Distance from (x, y) to the segment (ax, ay)–(bx, by). */
export const segDist = (x: number, y: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax, dy = by - ay, k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - ax - k * dx, y - ay - k * dy);
};

const hash = (i: number, j: number) => rnd(i * 57.13 + j * 131.71);

/** Smooth 2D value noise in [0, 1]. */
export const vnoise = (x: number, z: number) => {
  const i = Math.floor(x), j = Math.floor(z), u = ease(x - i), v = ease(z - j);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
