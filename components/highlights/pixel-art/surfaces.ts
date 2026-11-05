import { PIXEL_COUNT } from "./constants";
import { GOLDEN_ANGLE, normalize, times, type Vec3 } from "./math";
import type { Ellipsoid, Pt } from "./types";

const INSIDE = 0.97;

export const toPixelCount = (pts: Pt[]) => times(PIXEL_COUNT, (i) => pts[Math.floor((i * pts.length) / PIXEL_COUNT)]);

export const ellipsoid = (count: number, { center: c, radii: r }: Ellipsoid, extra: Partial<Pt> = {}): Pt[] =>
  times(count, (i) => {
    const y = 1 - (2 * (i + 0.5)) / count, ringRadius = Math.sqrt(1 - y * y), angle = i * GOLDEN_ANGLE;
    return { x: c[0] + Math.cos(angle) * ringRadius * r[0], y: c[1] + y * r[1], z: c[2] + Math.sin(angle) * ringRadius * r[2], ...extra };
  });

export const inEllipsoid = (p: Pt, { center: c, radii: r }: Ellipsoid) =>
  ((p.x - c[0]) / r[0]) ** 2 + ((p.y - c[1]) / r[1]) ** 2 + ((p.z - c[2]) / r[2]) ** 2 < INSIDE;

const ellipsoidNormal = (p: Pt, { center: c, radii: r }: Ellipsoid) =>
  normalize([(p.x - c[0]) / r[0] ** 2, (p.y - c[1]) / r[1] ** 2, (p.z - c[2]) / r[2] ** 2]);

export const shell = (count: number, shape: Ellipsoid, keep: (p: Pt) => boolean): Pt[] =>
  ellipsoid(count, shape).filter(keep).map((p) => ({ ...p, normal: ellipsoidNormal(p, shape) }));

const UNIT_SPHERE: Ellipsoid = { center: [0, 0, 0], radii: [1, 1, 1] };

const superellipsoidSum = (x: number, y: number, z: number, r: Vec3, power: number) =>
  Math.abs(x / r[0]) ** power + Math.abs(y / r[1]) ** power + Math.abs(z / r[2]) ** power;

export const inRoundBox = (p: Pt, radii: Vec3, power: number) => superellipsoidSum(p.x, p.y, p.z, radii, power) < INSIDE;

export const roundBox = (count: number, c: Vec3, r: Vec3, power: number, extra: Partial<Pt> = {}): Pt[] =>
  ellipsoid(count, UNIT_SPHERE).map(({ x, y, z }) => {
    const toSurface = superellipsoidSum(x, y, z, r, power) ** (-1 / power);
    const gradient = (v: number, radius: number) => (Math.sign(v) * Math.abs(v / radius) ** (power - 1)) / radius;
    const sx = x * toSurface, sy = y * toSurface, sz = z * toSurface;
    return { x: c[0] + sx, y: c[1] + sy, z: c[2] + sz, normal: normalize([gradient(sx, r[0]), gradient(sy, r[1]), gradient(sz, r[2])]), ...extra };
  });

export const turn = (p: Pt, angle: number, cx: number, cz: number): Pt => {
  const c = Math.cos(angle), s = Math.sin(angle), x = p.x - cx, z = p.z - cz;
  const normal = p.normal && [p.normal[0] * c + p.normal[2] * s, p.normal[1], -p.normal[0] * s + p.normal[2] * c];
  return { ...p, x: cx + x * c + z * s, z: cz - x * s + z * c, normal };
};

export const roll = (p: Pt, angle: number, cx: number, cy: number): Pt => {
  const c = Math.cos(angle), s = Math.sin(angle), x = p.x - cx, y = p.y - cy;
  const normal = p.normal && [p.normal[0] * c - p.normal[1] * s, p.normal[0] * s + p.normal[1] * c, p.normal[2]];
  return { ...p, x: cx + x * c - y * s, y: cy + x * s + y * c, normal };
};

export const placeAt = (p: Pt, [px, py, pz]: Vec3, scale = 1): Pt => ({ ...p, x: p.x * scale + px, y: p.y * scale + py, z: p.z * scale + pz });
