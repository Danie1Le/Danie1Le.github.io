import { ease, unit } from "../../math";
import type { Pt } from "../../types";
import { HW, frontZ, inHead } from "./profile";

// What the head's surface doesn't give on its own: the drawn features of the face, the ears and the neck.

/** A contour pixel lying on the face, lit by the face's own surface direction there. */
const onFace = (x: number, y: number, a: number): Pt | null => {
  const z = frontZ(x, y);
  if (!isFinite(z)) return null;
  const e = 0.004, zx = (frontZ(x + e, y) - frontZ(x - e, y)) / (2 * e), zy = (frontZ(x, y + e) - frontZ(x, y - e)) / (2 * e);
  return { x, y, z, spin: true, a, n: unit([zx, zy, -1]) }; // outward normal of the surface z = frontZ(x, y)
};

/** Almond eyes with their irises, then the line of the mouth. */
export function faceLines(): Pt[] {
  const pts: Pt[] = [];
  const add = (p: Pt | null) => p && pts.push(p);
  for (const s of [-1, 1]) {
    for (let j = 0; j < 36; j++) { // almond eye
      const u = (j / 36) * Math.PI * 2;
      add(onFace(s * 0.3 + Math.cos(u) * 0.12, 0.2 + Math.sin(u) * (Math.sin(u) > 0 ? 0.045 : 0.03), 1.5));
    }
    for (let j = 0; j < 8; j++) { const u = (j / 8) * Math.PI * 2; add(onFace(s * 0.3 + Math.cos(u) * 0.025, 0.2 + Math.sin(u) * 0.025, 1.8)); } // iris
  }
  for (let j = 0; j < 50; j++) { const u = (j / 49) * 2 - 1; add(onFace(u * 0.23, -0.515 + 0.025 * (1 - u * u), 1.5)); } // mouth line
  return pts;
}

/** Each ear: the outer rim (helix) with its lobe, and the fold inside it. */
export function ears(): Pt[] {
  const pts: Pt[] = [];
  for (const s of [-1, 1]) {
    const ex = s * (HW(0.12) + 0.015);
    for (let j = 0; j < 48; j++) {
      const u = -Math.PI * 0.6 + (j / 47) * Math.PI * 1.8, lobe = Math.sin(u) < 0 ? 0.75 : 1;
      pts.push({ x: ex, y: 0.12 + Math.sin(u) * 0.26, z: 0.36 + Math.cos(u) * 0.13 * lobe, spin: true, a: 1.3, n: unit([s, 0.1, 0.35]) });
    }
    for (let j = 0; j < 30; j++) {
      const u = -Math.PI * 0.3 + (j / 29) * Math.PI * 1.4;
      pts.push({ x: ex - s * 0.01, y: 0.14 + Math.sin(u) * 0.14, z: 0.34 + Math.cos(u) * 0.07, spin: true, a: 0.9, n: unit([s, 0, 0.3]) });
    }
  }
  return pts;
}

/** The neck, from under the skull, flaring into the top of the shoulders (what the head hides is left out). */
export function neck(): Pt[] {
  const pts: Pt[] = [];
  for (let j = 0; j < 320; j++) {
    const u = j * 2.399963, k = j / 320, y = -0.45 - k * 1.18, flare = ease(Math.max(0, (k - 0.65) / 0.35));
    const r = 0.37 + 0.4 * flare, x = Math.cos(u) * r, z = 0.38 - 0.08 * k + Math.sin(u) * r * 0.85;
    if (!inHead(x, y, z)) pts.push({ x, y, z, spin: true, a: 1, n: unit([Math.cos(u), 0.5 * flare, Math.sin(u)]) });
  }
  return pts;
}
