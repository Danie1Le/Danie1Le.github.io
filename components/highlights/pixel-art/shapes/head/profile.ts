import { TAU, clamp, clamp01, cross, normalize, signedPow, subtract, type Vec3 } from "../../math";
import type { Pt } from "../../types";
import { relief } from "./face";

const SLICE_HEIGHTS = [1.17, 1.13, 1.05, 0.85, 0.55, 0.25, 0, -0.25, -0.45, -0.6, -0.8, -0.95, -1.04];
const CROWN_Y = SLICE_HEIGHTS[0];
const CHIN_Y = SLICE_HEIGHTS[SLICE_HEIGHTS.length - 1];

const segmentAbove = (y: number) => {
  let i = 0;
  while (i < SLICE_HEIGHTS.length - 2 && y < SLICE_HEIGHTS[i + 1]) i++;
  return i;
};

const catmullRom = (p0: number, p1: number, p2: number, p3: number, k: number) =>
  0.5 * (2 * p1 + (p2 - p0) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (3 * p1 - p0 - 3 * p2 + p3) * k * k * k);

const smoothCurveThrough = (values: number[]) => (y: number) => {
  const i = segmentAbove(y);
  const k = clamp01((SLICE_HEIGHTS[i] - y) / (SLICE_HEIGHTS[i] - SLICE_HEIGHTS[i + 1]));
  const at = (index: number) => values[clamp(index, 0, values.length - 1)];
  return catmullRom(at(i - 1), at(i), at(i + 1), at(i + 2), k);
};

export const halfWidth = smoothCurveThrough([0, 0.23, 0.38, 0.59, 0.74, 0.78, 0.76, 0.72, 0.68, 0.63, 0.48, 0.28, 0.16]);
const frontZ = smoothCurveThrough([0.3, 0.01, -0.19, -0.46, -0.65, -0.7, -0.69, -0.66, -0.63, -0.6, -0.57, -0.5, -0.4]);
const backZ = smoothCurveThrough([0.3, 0.59, 0.79, 1.06, 1.25, 1.3, 1.2, 0.95, 0.55, 0.42, 0.08, -0.22, -0.36]);
const frontSquareness = smoothCurveThrough([2.2, 2.2, 2.2, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 2.9, 3, 3, 3]);
const backSquareness = smoothCurveThrough([2.2, 2.2, 2.2, 2.2, 2.25, 2.25, 2.3, 2.4, 2.6, 2.9, 3, 3, 3]);

const sliceAt = (y: number) => {
  const front = frontZ(y), back = backZ(y);
  return { halfWidth: halfWidth(y), centerZ: (front + back) / 2, halfDepth: (back - front) / 2 };
};

const reliefFadeIn = (towardFront: number) => Math.min(1, towardFront * 3);

const slicePoint = (y: number, angle: number): Vec3 => {
  const { halfWidth, centerZ, halfDepth } = sliceAt(y);
  const cos = Math.cos(angle), sin = Math.sin(angle), onFront = sin < 0;
  const exponent = 2 / (onFront ? frontSquareness(y) : backSquareness(y));
  const x = halfWidth * signedPow(cos, exponent);
  let z = centerZ + halfDepth * signedPow(sin, exponent);
  if (onFront) z -= relief(x, y) * reliefFadeIn(-sin);
  return [x, y, z];
};

export const faceSurfaceZ = (x: number, y: number) => {
  const { halfWidth, centerZ, halfDepth } = sliceAt(y);
  const power = frontSquareness(y);
  if (Math.abs(x) >= halfWidth) return NaN;
  const towardFront = Math.sqrt(1 - (Math.abs(x) / halfWidth) ** power);
  return centerZ - halfDepth * towardFront ** (2 / power) - relief(x, y) * reliefFadeIn(towardFront);
};

export const inHead = (x: number, y: number, z: number) => {
  if (y > CROWN_Y || y < CHIN_Y) return false;
  const { halfWidth, centerZ, halfDepth } = sliceAt(y);
  const power = z < centerZ ? frontSquareness(y) : backSquareness(y);
  return Math.abs(x / halfWidth) ** power + Math.abs((z - centerZ) / halfDepth) ** power < 0.92;
};

const ROW_STEP = 0.002;
const ROW_SPACING = 0.058;
const JAW_UNDERSIDE_WEIGHT = 0.45;
const OUTLINE_WEIGHTS = [1, 1, JAW_UNDERSIDE_WEIGHT];
const SAMPLES_PER_ROW = 360;
const FACE_SPACING = 0.05;
const BACK_SPACING = 0.085;
const NORMAL_STEP = 0.003;

const outline = (y: number) => [halfWidth(y), frontZ(y), backZ(y)];

function rowHeights(spacing: number) {
  const rows: number[] = [];
  let travelled = 0, previous = outline(CROWN_Y);
  for (let y = CROWN_Y; y >= CHIN_Y; y -= ROW_STEP) {
    const current = outline(y);
    const change = Math.max(...current.map((v, i) => Math.abs(v - previous[i]) * OUTLINE_WEIGHTS[i]));
    travelled += Math.hypot(ROW_STEP, change);
    previous = current;
    if (travelled >= ROW_SPACING * spacing) {
      rows.push(y);
      travelled = 0;
    }
  }
  return rows;
}

function surfaceNormal(y: number, angle: number) {
  const alongRow = subtract(slicePoint(y, angle + NORMAL_STEP), slicePoint(y, angle - NORMAL_STEP));
  const downHead = subtract(slicePoint(y + NORMAL_STEP, angle), slicePoint(y - NORMAL_STEP, angle));
  return normalize(cross(downHead, alongRow));
}

function rowPoints(y: number, rowIndex: number, spacing: number): Pt[] {
  const pts: Pt[] = [];
  let untilNextPixel = (rowIndex % 2) * 0.5, last = slicePoint(y, -Math.PI);
  for (let j = 1; j <= SAMPLES_PER_ROW; j++) {
    const angle = -Math.PI + (j / SAMPLES_PER_ROW) * TAU, p = slicePoint(y, angle);
    const pixelGap = (Math.sin(angle) < 0 ? FACE_SPACING : BACK_SPACING) * spacing;
    untilNextPixel += Math.hypot(p[0] - last[0], p[2] - last[2]) / pixelGap;
    last = p;
    if (untilNextPixel < 1) continue;
    untilNextPixel -= 1;
    pts.push({ x: p[0], y: p[1], z: p[2], brightness: 1, normal: surfaceNormal(y, angle) });
  }
  return pts;
}

export const headSurface = (spacing: number): Pt[] => [
  { x: 0, y: CROWN_Y, z: 0.3, normal: [0, 1, 0] },
  ...rowHeights(spacing).flatMap((y, rowIndex) => rowPoints(y, rowIndex, spacing)),
];
