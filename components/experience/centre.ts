import { scrollPageBy } from "@/lib/motion";
import { NAV_HEIGHT } from "@/lib/sections";

/** What the centring needs from a role row. JobRow provides it, so only JobRow knows its own markup. */
export interface RowHandle {
  el: HTMLElement;
  /** Height of the title row. */
  headHeight: () => number;
  /** Height of the bullets when fully open, measured even while they are shut. */
  contentHeight: () => number;
  /** Height of the bullets right now: how far the row shrinks as it closes. */
  detailsHeight: () => number;
}

/**
 * Scroll so a row of the given final height sits dead centre (or just under the nav if it's taller than the screen).
 * `lift` is how far the row will rise because a role above it is closing at the same time.
 */
export function centreRow(li: HTMLElement, height: number, lift = 0) {
  const target = Math.max(NAV_HEIGHT, (window.innerHeight - height) / 2);
  scrollPageBy(li.getBoundingClientRect().top - lift - target);
}

/** Closing a row from far down the page: bring its title back on screen. */
export function keepTitleOnScreen(li: HTMLElement, titleHeight: number) {
  if (li.getBoundingClientRect().top < NAV_HEIGHT) centreRow(li, titleHeight);
}
