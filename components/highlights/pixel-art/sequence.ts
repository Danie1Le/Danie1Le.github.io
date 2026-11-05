import { GOLDEN_ANGLE, TAU } from "./math";

export const times = <T>(count: number, make: (index: number) => T) => Array.from({ length: count }, (_, i) => make(i));

export const around = <T>(count: number, make: (angle: number, index: number) => T) =>
  times(count, (i) => make((i / count) * TAU, i));

export const spiral = <T>(count: number, make: (angle: number, down: number) => T) =>
  times(count, (i) => make(i * GOLDEN_ANGLE, i / count));

export const grid = <T>(columns: number, rows: number, make: (column: number, row: number) => T) =>
  times(columns * rows, (i) => make(i % columns, Math.floor(i / columns)));
