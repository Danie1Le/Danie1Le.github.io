export type Vec3 = [number, number, number];

export const TAU = Math.PI * 2;

export const GOLDEN_ANGLE = 2.399963;

export const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const clamp01 = (value: number) => clamp(value, 0, 1);

export const smoothstep = (k: number) => k * k * (3 - 2 * k);

export const gaussian = (distance: number, width: number) => Math.exp(-(distance * distance) / (2 * width * width));

export const easeToward = (current: number, target: number, rate: number) => current + (target - current) * rate;

export const signedPow = (value: number, exponent: number) => Math.sign(value) * Math.abs(value) ** exponent;

export const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
};

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

export const distanceToSegment = (x: number, y: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax, dy = by - ay;
  const along = clamp01(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy));
  return Math.hypot(x - ax - along * dx, y - ay - along * dy);
};

const latticeValue = (i: number, j: number) => seededRandom(i * 57.13 + j * 131.71);

export const valueNoise = (x: number, z: number) => {
  const i = Math.floor(x), j = Math.floor(z), u = smoothstep(x - i), v = smoothstep(z - j);
  const a = latticeValue(i, j), b = latticeValue(i + 1, j), c = latticeValue(i, j + 1), d = latticeValue(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
