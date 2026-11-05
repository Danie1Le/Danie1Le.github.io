import type { Pt } from "../types";

export const onScanLine = (p: Pt, scanY: number, thickness: number) => Math.abs(p.y - scanY) < thickness;
