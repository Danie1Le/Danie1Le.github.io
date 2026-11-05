import type { CSSProperties } from "react";

export { prefersReducedMotion } from "./media";

export const revealOrder = (step: number) => ({ "--i": step }) as CSSProperties;

export const animDelay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export const staggeredDelay = (firstSeconds: number, stepSeconds: number, index: number) => animDelay(firstSeconds + index * stepSeconds);
