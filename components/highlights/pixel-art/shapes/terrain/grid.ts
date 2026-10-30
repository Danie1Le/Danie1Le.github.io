import { unit } from "../../math";
import { fractal } from "./fractal";

// The map: an 80 × 30 grid of heights sampled from the fractal, one pixel per point.
export const COLS = 80, ROWS = 30; // COLS × ROWS = N, one pixel per grid point
export const gx = (i: number) => -4 + (i / (COLS - 1)) * 8, gz = (j: number) => -1.3 + (j / (ROWS - 1)) * 2.6;
const RAW = Array.from({ length: COLS * ROWS }, (_, k) => {
  const x = gx(k % COLS), z = gz(Math.floor(k / COLS));
  return fractal(x, z) + 0.55 * Math.exp(-((x - 1.4) ** 2 + (z + 0.1) ** 2) / 0.18); // one summit stands above the rest
});
const LO = Math.min(...RAW), HI = Math.max(...RAW);
const HGT = RAW.map((v) => -0.8 + 1.6 * ((v - LO) / (HI - LO)) ** 1.6); // sharpened: pointed peaks, open valleys
export const gy = (i: number, j: number) => HGT[j * COLS + i];
export const SUMMIT = (() => { const k = HGT.indexOf(Math.max(...HGT)); return [k % COLS, Math.floor(k / COLS)]; })();
const SUN = unit([-0.7, 0.9, 0.6]); // hillshade light, from the map's upper left like a printed relief map
export const hillshade = (i: number, j: number) => {
  const dx = (gy(Math.min(COLS - 1, i + 1), j) - gy(Math.max(0, i - 1), j)) / (gx(1) - gx(0)) / 2;
  const dz = (gy(i, Math.min(ROWS - 1, j + 1)) - gy(i, Math.max(0, j - 1))) / (gz(1) - gz(0)) / 2;
  const n = unit([-dx, 1, -dz]);
  return 0.06 + 1.3 * Math.max(0, n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) ** 1.6 + 0.3 * (gy(i, j) + 0.8);
};
