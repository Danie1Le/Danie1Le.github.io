import { unit } from "./math";

// How opaque each pixel is drawn. On a dark ground the pixels are light, so lit means brighter; on a light ground
// they are ink, so shade means darker.

const VIEW_LIGHT = unit([-0.6, 0.55, -0.75]); // in view space: from the upper left and to the side, like portrait lighting

/** Is this #rrggbb colour light? (Light ink means a dark ground, where glow reads as light.) */
export const isLightColor = (hex: string) => { const n = parseInt(hex.replace("#", ""), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 128; };

/** A pixel with a surface direction (`view`, from the camera), lit live; pixels on the far side are dimmed so the figure reads solid. */
export function litAlpha([nx, ny2, nz2]: number[], a: number, darkGround: boolean) {
  const facing = -nz2;
  const lit = Math.max(0, nx * VIEW_LIGHT[0] + ny2 * VIEW_LIGHT[1] + nz2 * VIEW_LIGHT[2]);
  const tone = darkGround
    ? 0.12 + 0.95 * lit ** 1.3 + (facing > 0 ? 0.55 * (1 - facing) ** 2 : 0)
    : 0.22 + 0.75 * (1 - lit ** 1.3) + (facing > 0 ? 0.4 * (1 - facing) ** 2 : 0);
  return Math.min(1, tone * a) * (facing > -0.05 ? 1 : 0.08);
}

/** A pixel without one: nearer is stronger. `printed` turns hillshade brightness into a printed map's shadow. */
export function depthAlpha(z2: number, a: number, printed: boolean) {
  const tone = printed ? 0.1 + 0.85 * Math.max(0, 1 - a / 1.6) : a;
  return Math.min(1, (0.3 + 0.7 * (1 - z2) / 2) * tone);
}
