import type { CSSProperties } from "react";

/** True when the visitor has asked their system for less motion. Reads `window`, so call it in effects and handlers. */
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll the page by `top` px: smoothly, or in one jump under reduced motion. */
export const scrollPageBy = (top: number) =>
  window.scrollBy({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });

/** Entrance order of a [data-reveal] element within its section: each step starts 80ms later (see globals.css). */
export const revealOrder = (i: number) => ({ "--i": i }) as CSSProperties;

/** Start delay, in seconds, for the CSS animations that read --d (.letter, .rise, .bar-grow). */
export const animDelay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;
