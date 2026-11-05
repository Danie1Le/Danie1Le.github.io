import { clamp, dot, normalize } from "../../math";
import { fractal } from "./fractal";

export const COLS = 80, ROWS = 30;

export const columnX = (i: number) => -4 + (i / (COLS - 1)) * 8;
export const rowZ = (j: number) => -1.3 + (j / (ROWS - 1)) * 2.6;
export const clampColumn = (i: number) => clamp(i, 0, COLS - 1);
export const clampRow = (j: number) => clamp(j, 0, ROWS - 1);

const summitBump = (x: number, z: number) => 0.55 * Math.exp(-((x - 1.4) ** 2 + (z + 0.1) ** 2) / 0.18);

const RAW = Array.from({ length: COLS * ROWS }, (_, k) => {
  const x = columnX(k % COLS), z = rowZ(Math.floor(k / COLS));
  return fractal(x, z) + summitBump(x, z);
});
const LOWEST = Math.min(...RAW), HIGHEST = Math.max(...RAW);
const sharpenPeaks = (raw: number) => -0.8 + 1.6 * ((raw - LOWEST) / (HIGHEST - LOWEST)) ** 1.6;
const HEIGHTS = RAW.map(sharpenPeaks);

export const heightAt = (i: number, j: number) => HEIGHTS[j * COLS + i];

export const SUMMIT = (() => {
  const k = HEIGHTS.indexOf(Math.max(...HEIGHTS));
  return [k % COLS, Math.floor(k / COLS)];
})();

const SUN = normalize([-0.7, 0.9, 0.6]);

export const hillshade = (i: number, j: number) => {
  const slopeX = (heightAt(clampColumn(i + 1), j) - heightAt(clampColumn(i - 1), j)) / (columnX(1) - columnX(0)) / 2;
  const slopeZ = (heightAt(i, clampRow(j + 1)) - heightAt(i, clampRow(j - 1))) / (rowZ(1) - rowZ(0)) / 2;
  const normal = normalize([-slopeX, 1, -slopeZ]);
  return 0.06 + 1.3 * Math.max(0, dot(normal, SUN)) ** 1.6 + 0.3 * (heightAt(i, j) + 0.8);
};
