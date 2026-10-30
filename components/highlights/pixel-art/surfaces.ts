import { N } from "./constants";
import { unit } from "./math";
import type { Pt } from "./types";

/** Exactly N points from any list, by even up- or down-sampling, so every shape has the same pixel count. */
export const fit = (pts: Pt[]) => Array.from({ length: N }, (_, i) => pts[Math.floor((i * pts.length) / N)]);

/** n points spread evenly over an ellipsoid's surface (a Fibonacci sphere), centre c, radii r. */
export const ellipsoid = (n: number, c: number[], r: number[], extra: Partial<Pt> = {}): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
    return { x: c[0] + Math.cos(th) * rr * r[0], y: c[1] + y * r[1], z: c[2] + Math.sin(th) * rr * r[2], spin: true, ...extra };
  });

/** Is p just inside the ellipsoid (centre c, radii r)? Used to drop points one part hides inside another. */
export const inEllipsoid = (p: Pt, c: number[], r: number[]) => ((p.x - c[0]) / r[0]) ** 2 + ((p.y - c[1]) / r[1]) ** 2 + ((p.z - c[2]) / r[2]) ** 2 < 0.97;

/** Points on an ellipsoid that pass `keep`, each with its outward surface direction. */
export const shell = (n: number, c: number[], r: number[], keep: (p: Pt) => boolean): Pt[] =>
  ellipsoid(n, c, r).filter(keep).map((p) => ({ ...p, n: unit([(p.x - c[0]) / r[0] ** 2, (p.y - c[1]) / r[1] ** 2, (p.z - c[2]) / r[2] ** 2]) }));

/** A rounded box (a superellipsoid: exponent 2 is an ellipsoid, higher is boxier), with surface directions. */
export const roundBox = (n: number, c: number[], r: number[], p: number, extra: Partial<Pt> = {}): Pt[] =>
  ellipsoid(n, [0, 0, 0], [1, 1, 1]).map(({ x, y, z }) => {
    const k = (Math.abs(x / r[0]) ** p + Math.abs(y / r[1]) ** p + Math.abs(z / r[2]) ** p) ** (-1 / p);
    const g = (v: number, rr: number) => (Math.sign(v) * Math.abs(v / rr) ** (p - 1)) / rr;
    return { x: c[0] + x * k, y: c[1] + y * k, z: c[2] + z * k, spin: true, n: unit([g(x * k, r[0]), g(y * k, r[1]), g(z * k, r[2])]), ...extra };
  });

/** Turn a point and its surface direction about a vertical axis through (cx, cz), the same way the camera's yaw turns. */
export const turn = (p: Pt, ang: number, cx: number, cz: number): Pt => {
  const c = Math.cos(ang), s = Math.sin(ang), x = p.x - cx, z = p.z - cz;
  return { ...p, x: cx + x * c + z * s, z: cz - x * s + z * c, n: p.n && [p.n[0] * c + p.n[2] * s, p.n[1], -p.n[0] * s + p.n[2] * c] };
};

/** Roll a point about a horizontal (front-to-back) axis through (cx, cy), the way a wheel turns. */
export const roll = (p: Pt, ang: number, cx: number, cy: number): Pt => {
  const c = Math.cos(ang), s = Math.sin(ang), x = p.x - cx, y = p.y - cy;
  return { ...p, x: cx + x * c - y * s, y: cy + x * s + y * c, n: p.n && [p.n[0] * c - p.n[1] * s, p.n[0] * s + p.n[1] * c, p.n[2]] };
};
