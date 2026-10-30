import { unit } from "../../math";
import type { Pt } from "../../types";
import { relief } from "./face";

// ResVR: a human head as a hologram, built like a contour model from horizontal slices. Each slice is a rounded
// outline whose width, front and back follow a real head's profile: a domed crown, flat sides, a square jaw angle
// under the ears, then a jawline narrowing to a squared chin. The face's relief is pressed into the front.
const HY = [1.17, 1.13, 1.05, 0.85, 0.55, 0.25, 0, -0.25, -0.45, -0.6, -0.8, -0.95, -1.04]; // slice heights, crown to chin
const profile = (vs: number[]) => (y: number) => { // a smooth curve (Catmull-Rom) through the values at HY
  let i = 0;
  while (i < HY.length - 2 && y < HY[i + 1]) i++;
  const k = Math.max(0, Math.min(1, (HY[i] - y) / (HY[i] - HY[i + 1])));
  const p0 = vs[Math.max(0, i - 1)], p1 = vs[i], p2 = vs[i + 1], p3 = vs[Math.min(vs.length - 1, i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (3 * p1 - p0 - 3 * p2 + p3) * k * k * k);
};
export const HW = profile([0, 0.23, 0.38, 0.59, 0.74, 0.78, 0.76, 0.72, 0.68, 0.63, 0.48, 0.28, 0.16]); // half-width
const HF = profile([0.3, 0.01, -0.19, -0.46, -0.65, -0.7, -0.69, -0.66, -0.63, -0.6, -0.57, -0.5, -0.4]); // front (face)
const HB = profile([0.3, 0.59, 0.79, 1.06, 1.25, 1.3, 1.2, 0.95, 0.55, 0.42, 0.08, -0.22, -0.36]); // back, then the jaw's back edge and underside
const HPF = profile([2.2, 2.2, 2.2, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 2.9, 3, 3, 3]); // squareness of the front half
const HPB = profile([2.2, 2.2, 2.2, 2.2, 2.25, 2.25, 2.3, 2.4, 2.6, 2.9, 3, 3, 3]); // and of the back half
export const TOP = HY[0], CHIN = HY[HY.length - 1];
export const slice = (y: number, u: number) => { // the point at angle u round the slice at height y (u in (-π, 0) is the front)
  const a = HW(y), f = HF(y), b = HB(y), c = Math.cos(u), s = Math.sin(u), e = 2 / (s < 0 ? HPF(y) : HPB(y));
  const x = a * Math.sign(c) * Math.abs(c) ** e;
  let z = (f + b) / 2 + ((b - f) / 2) * Math.sign(s) * Math.abs(s) ** e;
  if (s < 0) z -= relief(x, y) * Math.min(1, -s * 3);
  return [x, y, z];
};
export const frontZ = (x: number, y: number) => { // the face's depth at (x, y): slice() solved for the front point at that x
  const a = HW(y), f = HF(y), b = HB(y), pf = HPF(y);
  if (Math.abs(x) >= a) return NaN;
  const s = Math.sqrt(1 - (Math.abs(x) / a) ** pf);
  return (f + b) / 2 - ((b - f) / 2) * s ** (2 / pf) - relief(x, y) * Math.min(1, s * 3);
};
export const inHead = (x: number, y: number, z: number) => {
  if (y > TOP || y < CHIN) return false;
  const a = HW(y), f = HF(y), b = HB(y), zc = (f + b) / 2, p = z < zc ? HPF(y) : HPB(y);
  return Math.abs(x / a) ** p + Math.abs((z - zc) / ((b - f) / 2)) ** p < 0.92;
};
// The surface as rows of pixels, spaced evenly along the head's outline (so the crown and under the jaw are as full
// as the face), denser on the face than the back of the head. `k` scales every spacing.
export const headSurface = (k: number): Pt[] => {
  const pts: Pt[] = [{ x: 0, y: TOP, z: 0.3, spin: true, n: [0, 1, 0] }];
  const rows: number[] = [];
  let acc = 0, prev = [HW(TOP), HF(TOP), HB(TOP)];
  for (let y = TOP; y >= CHIN; y -= 0.002) {
    const cur = [HW(y), HF(y), HB(y)];
    acc += Math.hypot(0.002, Math.max(...cur.map((v, i) => Math.abs(v - prev[i]) * (i === 2 ? 0.45 : 1)))); // the jaw's underside, rarely seen, counts less
    prev = cur;
    if (acc >= 0.058 * k) { rows.push(y); acc = 0; }
  }
  rows.forEach((y, r) => {
    let run = (r % 2) * 0.5, last = slice(y, -Math.PI);
    for (let j = 1; j <= 360; j++) {
      const u = -Math.PI + (j / 360) * Math.PI * 2, p = slice(y, u);
      run += Math.hypot(p[0] - last[0], p[2] - last[2]) / ((Math.sin(u) < 0 ? 0.05 : 0.085) * k);
      last = p;
      if (run < 1) continue;
      run -= 1;
      const e = 0.003, du = slice(y, u + e).map((v, i) => v - slice(y, u - e)[i]), dy = slice(y + e, u).map((v, i) => v - slice(y - e, u)[i]);
      pts.push({ x: p[0], y: p[1], z: p[2], spin: true, a: 1, n: unit([dy[1] * du[2] - dy[2] * du[1], dy[2] * du[0] - dy[0] * du[2], dy[0] * du[1] - dy[1] * du[0]]) });
    }
  });
  return pts;
};
