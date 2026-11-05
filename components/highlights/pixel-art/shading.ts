import { dot, normalize, type Vec3 } from "./math";

const VIEW_LIGHT = normalize([-0.6, 0.55, -0.75]);
const FAR_SIDE_DIM = 0.08;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

const perceivedBrightness = ([r, g, b]: number[]) => (r * 299 + g * 587 + b * 114) / 1000;

export const isLightColor = (hex: string) => perceivedBrightness(hexToRgb(hex)) > 128;

export function litAlpha(viewNormal: Vec3, brightness: number, darkGround: boolean) {
  const facing = -viewNormal[2];
  const lit = Math.max(0, dot(viewNormal, VIEW_LIGHT));
  const rimLight = (strength: number) => (facing > 0 ? strength * (1 - facing) ** 2 : 0);
  const tone = darkGround
    ? 0.12 + 0.95 * lit ** 1.3 + rimLight(0.55)
    : 0.22 + 0.75 * (1 - lit ** 1.3) + rimLight(0.4);
  const visibility = facing > -0.05 ? 1 : FAR_SIDE_DIM;
  return Math.min(1, tone * brightness) * visibility;
}

export function depthAlpha(depth: number, brightness: number, printedShadow: boolean) {
  const tone = printedShadow ? 0.1 + 0.85 * Math.max(0, 1 - brightness / 1.6) : brightness;
  return Math.min(1, (0.3 + 0.7 * (1 - depth) / 2) * tone);
}
