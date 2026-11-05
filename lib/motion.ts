import type { CSSProperties } from "react";

export { prefersReducedMotion } from "./media";
export { scrollPageBy } from "./scroll";

export const revealOrder = (step: number) => ({ "--i": step }) as CSSProperties;

export const animDelay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;
