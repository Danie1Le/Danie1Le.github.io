import { scrollPageBy } from "@/lib/motion";

const NAV = 80; // keep rows clear of the fixed nav bar

/**
 * Scroll so a row of the given final height sits dead centre (or just under the nav if it's taller than the screen).
 * `lift` is how far the row will rise because a role above it is closing at the same time.
 */
export function centreRow(li: HTMLElement, height: number, lift = 0) {
  const target = Math.max(NAV, (window.innerHeight - height) / 2);
  scrollPageBy(li.getBoundingClientRect().top - lift - target);
}

/** Closing a row from far down the page: bring its title back on screen. */
export function keepTitleOnScreen(li: HTMLElement, titleHeight: number) {
  if (li.getBoundingClientRect().top < NAV) centreRow(li, titleHeight);
}
