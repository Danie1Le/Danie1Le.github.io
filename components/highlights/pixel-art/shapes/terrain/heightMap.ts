import { PIXEL_COUNT } from "../../constants";
import { clamp, dot, normalize } from "../../math";
import { grid } from "../../sequence";
import { MAP_DEPTH, MAP_LEFT, MAP_NEAR, MAP_WIDTH } from "./extents";
import { fractal } from "./fractal";

export type Cell = [column: number, row: number];

export const COLS = 80, ROWS = PIXEL_COUNT / COLS;

export const cellIndex = ([column, row]: Cell) => row * COLS + column;
const cellAt = (index: number): Cell => [index % COLS, Math.floor(index / COLS)];

const columnX = (i: number) => MAP_LEFT + (i / (COLS - 1)) * MAP_WIDTH;
const rowZ = (j: number) => MAP_NEAR + (j / (ROWS - 1)) * MAP_DEPTH;
const clampColumn = (i: number) => clamp(i, 0, COLS - 1);
const clampRow = (j: number) => clamp(j, 0, ROWS - 1);
export const nudge = ([column, row]: Cell, [dc, dr]: Cell): Cell => [clampColumn(column + dc), clampRow(row + dr)];

const summitBump = (x: number, z: number) => 0.55 * Math.exp(-((x - 1.4) ** 2 + (z + 0.1) ** 2) / 0.18);

const RAW = grid(COLS, ROWS, (i, j) => {
  const x = columnX(i), z = rowZ(j);
  return fractal(x, z) + summitBump(x, z);
});
const LOWEST = Math.min(...RAW), HIGHEST = Math.max(...RAW);
const sharpenPeaks = (raw: number) => -0.8 + 1.6 * ((raw - LOWEST) / (HIGHEST - LOWEST)) ** 1.6;
const HEIGHTS = RAW.map(sharpenPeaks);

export const heightAt = (cell: Cell) => HEIGHTS[cellIndex(cell)];
export const groundAt = (cell: Cell) => ({ x: columnX(cell[0]), y: heightAt(cell), z: rowZ(cell[1]) });

export const SUMMIT = cellAt(HEIGHTS.indexOf(Math.max(...HEIGHTS)));

const SUN = normalize([-0.7, 0.9, 0.6]);

export const hillshade = (cell: Cell) => {
  const slopeX = (heightAt(nudge(cell, [1, 0])) - heightAt(nudge(cell, [-1, 0]))) / (columnX(1) - columnX(0)) / 2;
  const slopeZ = (heightAt(nudge(cell, [0, 1])) - heightAt(nudge(cell, [0, -1]))) / (rowZ(1) - rowZ(0)) / 2;
  const normal = normalize([-slopeX, 1, -slopeZ]);
  return 0.06 + 1.3 * Math.max(0, dot(normal, SUN)) ** 1.6 + 0.3 * (heightAt(cell) + 0.8);
};
