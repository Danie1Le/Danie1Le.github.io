import { grid } from "../sequence";
import type { Pt } from "../types";

const RED_PIXEL_SPACING = 0.03;

export const redSquare = (x: number, y: number, z: number, extra: Partial<Pt> = {}): Pt[] =>
  grid(2, 2, (column, row) => ({ x: x + column * RED_PIXEL_SPACING, y: y + row * RED_PIXEL_SPACING, z, red: true, ...extra }));
