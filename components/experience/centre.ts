import { scrollPageBy } from "@/lib/scroll";
import { NAV_HEIGHT } from "@/lib/sections";

const NAV_CLEARANCE = NAV_HEIGHT + 16;

export interface RowHandle {
  el: HTMLElement;
  titleRowHeight: () => number;
  openDetailsHeight: () => number;
  currentDetailsHeight: () => number;
}

export function centreRow(row: HTMLElement, finalHeight: number, riseFromRowAboveClosing = 0) {
  const targetTop = Math.max(NAV_CLEARANCE, (window.innerHeight - finalHeight) / 2);
  scrollPageBy(row.getBoundingClientRect().top - riseFromRowAboveClosing - targetTop);
}

export function keepTitleOnScreen(row: HTMLElement, titleHeight: number) {
  if (row.getBoundingClientRect().top < NAV_CLEARANCE) centreRow(row, titleHeight);
}
