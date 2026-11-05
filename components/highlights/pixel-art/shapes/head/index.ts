import { fillDot } from "../../canvas";
import { PIXEL_COUNT, ROLE_MS } from "../../constants";
import { TAU, smoothstep } from "../../math";
import { toPixelCount } from "../../surfaces";
import type { Draw, Pt, Shape } from "../../types";
import { ears, faceLines, neck } from "./features";
import { headSurface } from "./profile";

const TURN_MS = ROLE_MS * 0.92;
const SCAN_PERIOD_MS = 2800;
const SCAN_LINE_THICKNESS = 0.022;
const CENTERING_LIFT = 0.23;

function dottedWall({ ctx, width, height, ink, formed }: Draw) {
  const step = height / 8, radius = step * 0.11;
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.07 * formed;
  for (let y = step / 2; y < height; y += step)
    for (let x = (width / 2) % step; x < width; x += step) fillDot(ctx, x, y, radius);
}

function headPointsNear(target: number, features: Pt[]) {
  const roomForSurface = target - features.length;
  const atUnitSpacing = headSurface(1).length;
  return headSurface(Math.sqrt(atUnitSpacing / roomForSurface));
}

const scanLineY = (t: number) => 1.45 - ((t / SCAN_PERIOD_MS) % 1) * 2.95;

export function head(): Shape {
  const features = [...faceLines(), ...ears(), ...neck()];
  const surface = headPointsNear(PIXEL_COUNT, features);
  return {
    points: toPixelCount([...surface, ...features].map((p) => ({ ...p, y: p.y + CENTERING_LIFT }))),
    yaw: (t) => -TAU * smoothstep(Math.min(1, t / TURN_MS)),
    tilt: (t) => 0.14 + 0.22 * Math.sin(t / 1100),
    halfWidth: 1.05,
    halfHeight: 1.62,
    glow: 1,
    move: (p, t) => (Math.abs(p.y - scanLineY(t)) < SCAN_LINE_THICKNESS ? { ...p, red: true } : p),
    drawBehind: dottedWall,
  };
}
