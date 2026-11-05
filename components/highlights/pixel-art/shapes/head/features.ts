import { normalize, smoothstep } from "../../math";
import { around, spiral, spread } from "../../sequence";
import type { Pt } from "../../types";
import { faceSurfaceZ, halfWidth, inHead } from "./profile";

const EYE_X = 0.3;
const EYE_Y = 0.2;
const SLOPE_STEP = 0.004;
const EAR_Y = 0.12;

function onFace(x: number, y: number, brightness: number): Pt | null {
  const z = faceSurfaceZ(x, y);
  if (!isFinite(z)) return null;
  const slopeX = (faceSurfaceZ(x + SLOPE_STEP, y) - faceSurfaceZ(x - SLOPE_STEP, y)) / (2 * SLOPE_STEP);
  const slopeY = (faceSurfaceZ(x, y + SLOPE_STEP) - faceSurfaceZ(x, y - SLOPE_STEP)) / (2 * SLOPE_STEP);
  return { x, y, z, brightness, normal: normalize([slopeX, slopeY, -1]) };
}

const almondEye = (side: number) =>
  around(36, (angle) => onFace(side * EYE_X + Math.cos(angle) * 0.12, EYE_Y + Math.sin(angle) * (Math.sin(angle) > 0 ? 0.045 : 0.03), 1.5));

const iris = (side: number) =>
  around(8, (angle) => onFace(side * EYE_X + Math.cos(angle) * 0.025, EYE_Y + Math.sin(angle) * 0.025, 1.8));

const mouthLine = () =>
  spread(50, (fraction) => {
    const across = fraction * 2 - 1;
    return onFace(across * 0.23, -0.515 + 0.025 * (1 - across * across), 1.5);
  });

const isPoint = (p: Pt | null): p is Pt => p !== null;

export const faceLines = (): Pt[] =>
  [...[-1, 1].flatMap((side) => [...almondEye(side), ...iris(side)]), ...mouthLine()].filter(isPoint);

function ear(side: number): Pt[] {
  const earX = side * (halfWidth(EAR_Y) + 0.015);
  const helix = spread(48, (fraction): Pt => {
    const angle = -Math.PI * 0.6 + fraction * Math.PI * 1.8, lobe = Math.sin(angle) < 0 ? 0.75 : 1;
    return { x: earX, y: 0.12 + Math.sin(angle) * 0.26, z: 0.36 + Math.cos(angle) * 0.13 * lobe, brightness: 1.3, normal: normalize([side, 0.1, 0.35]) };
  });
  const innerFold = spread(30, (fraction): Pt => {
    const angle = -Math.PI * 0.3 + fraction * Math.PI * 1.4;
    return { x: earX - side * 0.01, y: 0.14 + Math.sin(angle) * 0.14, z: 0.34 + Math.cos(angle) * 0.07, brightness: 0.9, normal: normalize([side, 0, 0.3]) };
  });
  return [...helix, ...innerFold];
}

export const ears = (): Pt[] => [-1, 1].flatMap(ear);

const NECK_PIXELS = 320;

export const neck = (): Pt[] =>
  spiral(NECK_PIXELS, (angle, down): Pt => {
    const y = -0.45 - down * 1.18;
    const flare = smoothstep(Math.max(0, (down - 0.65) / 0.35));
    const radius = 0.37 + 0.4 * flare, x = Math.cos(angle) * radius, z = 0.38 - 0.08 * down + Math.sin(angle) * radius * 0.85;
    return { x, y, z, brightness: 1, normal: normalize([Math.cos(angle), 0.5 * flare, Math.sin(angle)]) };
  }).filter((p) => !inHead(p.x, p.y, p.z));
