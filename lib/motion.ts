import type { CSSProperties } from "react";

export const revealOrder = (step: number) => ({ "--i": step }) as CSSProperties;

export const animDelay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;
