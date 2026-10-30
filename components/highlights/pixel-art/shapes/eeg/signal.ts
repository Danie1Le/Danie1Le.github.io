import { ease } from "../../math";
import type { Pt } from "../../types";

// Eight channels of signal, flat on the screen, funnelling into the arrow that carries each decision to the car.

/** The channels' and the arrow's pixels. */
export function signalPoints(): Pt[] {
  const flat: Pt[] = [];
  for (let c = 0; c < 8; c++) for (let j = 0; j < 36; j++) flat.push({ x: -2.0 + (j / 35) * 1.8, y: 0.49 - c * 0.14, z: 0, w: c, g: "wave" });
  for (let j = 0; j < 26; j++) flat.push({ x: -0.15 + j * 0.04, y: 0, z: 0, g: "arrow" });
  for (const s of [1, -1]) for (let j = 1; j <= 8; j++) flat.push({ x: 0.85 - j * 0.03, y: s * j * 0.028, z: 0, g: "arrow" });
  return flat;
}

/** A channel or arrow pixel this frame. `beat` is how far (0-1) the current decision has travelled. */
export function moveSignal(p: Pt, t: number, beat: number): Pt {
  if (p.g === "wave") { // the channels run left to right and funnel into the arrow
    const u = (p.x + 2) / 1.8, pull = 0.9 * ease(u) ** 1.5, c = p.w!;
    const wave = 0.04 * Math.sin(p.x * (8 + c) - t / 140 + c * 1.7) + 0.022 * Math.sin(p.x * (21 + 2 * c) - t / 85 + c);
    return { ...p, y: p.y * (1 - pull) + wave * (1 - 0.6 * pull) };
  }
  return { ...p, red: Math.abs(p.x - (-0.2 + beat * 1.2)) < 0.12 }; // a decision travels down the arrow
}
