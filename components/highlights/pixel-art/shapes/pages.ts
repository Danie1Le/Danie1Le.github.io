import { ROLE_MS } from "../constants";
import { grid, times } from "../math";
import { toPixelCount } from "../surfaces";
import type { Pt, Shape } from "../types";

const PAGE_COUNT = 5;
const PAGE_WIDTH = 1.1;
const PAGE_HEIGHT = 1.44;
const PAGE_SPACING = 1.55;
const PAGES_WITH_ERRORS = [1, 3];
const OUTLINE_PIXELS = 90;
const SCAN_TOP = 0.8;
const SCAN_TRAVEL = 1.75;
const SCAN_MS = ROLE_MS * 0.75;
const PAGE_NUMBER_Y = -0.55;
const SCAN_LINE_THICKNESS = 0.035;

function pointOnOutline(distance: number) {
  const w = PAGE_WIDTH, h = PAGE_HEIGHT;
  let d = distance;
  if (d < w) return [-w / 2 + d, h / 2];
  if ((d -= w) < h) return [w / 2, h / 2 - d];
  if ((d -= h) < w) return [w / 2 - d, -h / 2];
  return [-w / 2, -h / 2 + d - w];
}

const pageOutline = (centerX: number): Pt[] =>
  times(OUTLINE_PIXELS, (j) => {
    const [x, y] = pointOnOutline((j / OUTLINE_PIXELS) * 2 * (PAGE_WIDTH + PAGE_HEIGHT));
    return { x: centerX + x, y, z: 0 };
  });

const textLines = (centerX: number): Pt[] =>
  grid(20, 8, (column, line) => {
    const length = 0.8 - (line % 3) * 0.16;
    return { x: centerX - 0.4 + (column / 19) * length, y: 0.5 - line * 0.13, z: 0 };
  });

const pageNumber = (centerX: number, flagged: boolean): Pt[] =>
  grid(10, 3, (column, row) => ({ x: centerX - 0.1 + column * 0.022, y: -0.6 + row * 0.03, z: 0, flagged }));

function page(index: number): Pt[] {
  const centerX = (index - 2) * PAGE_SPACING;
  return [...pageOutline(centerX), ...textLines(centerX), ...pageNumber(centerX, PAGES_WITH_ERRORS.includes(index))];
}

const scanLineY = (t: number) => SCAN_TOP - SCAN_TRAVEL * Math.min(1, t / SCAN_MS);

export function pages(): Shape {
  return {
    points: toPixelCount(times(PAGE_COUNT, page).flat()),
    yaw: (t) => 0.24 * Math.sin(t / 1800),
    tilt: () => 0.1,
    halfWidth: 4.7,
    move: (p, t) => {
      const scan = scanLineY(t);
      const errorFound = p.flagged && scan < PAGE_NUMBER_Y;
      return { ...p, red: errorFound || Math.abs(p.y - scan) < SCAN_LINE_THICKNESS };
    },
  };
}
