import { smoothstep } from "../../math";
import { grid, times } from "../../sequence";
import type { Pt } from "../../types";
import type { Decision } from "./decision";

const CHANNELS = 8;
const SAMPLES_PER_CHANNEL = 36;
const WAVE_LEFT = -2.0;
const WAVE_LENGTH = 1.8;
const ARROW_START = -0.2;
const ARROW_LENGTH = 1.2;
const PULSE_HALF_WIDTH = 0.12;

const channels = (): Pt[] =>
  grid(SAMPLES_PER_CHANNEL, CHANNELS, (j, channel) => ({
    x: WAVE_LEFT + (j / (SAMPLES_PER_CHANNEL - 1)) * WAVE_LENGTH,
    y: 0.49 - channel * 0.14,
    z: 0,
    partIndex: channel,
    part: "wave",
  }));

const arrowShaft = (): Pt[] => times(26, (j) => ({ x: -0.15 + j * 0.04, y: 0, z: 0, part: "arrow" }));

const arrowBarb = (side: number): Pt[] =>
  times(8, (k) => {
    const j = k + 1;
    return { x: 0.85 - j * 0.03, y: side * j * 0.028, z: 0, part: "arrow" };
  });

const arrow = (): Pt[] => [...arrowShaft(), ...[1, -1].flatMap(arrowBarb)];

export const signalPoints = (): Pt[] => [...channels(), ...arrow()];

function funnelIntoArrow(p: Pt, t: number): Pt {
  const along = (p.x - WAVE_LEFT) / WAVE_LENGTH, pull = 0.9 * smoothstep(along) ** 1.5, channel = p.partIndex!;
  const wave = 0.04 * Math.sin(p.x * (8 + channel) - t / 140 + channel * 1.7) + 0.022 * Math.sin(p.x * (21 + 2 * channel) - t / 85 + channel);
  return { ...p, y: p.y * (1 - pull) + wave * (1 - 0.6 * pull) };
}

const pulseAlongArrow = (p: Pt, { progress }: Decision): Pt =>
  ({ ...p, red: Math.abs(p.x - (ARROW_START + progress * ARROW_LENGTH)) < PULSE_HALF_WIDTH });

export const moveSignal = (p: Pt, t: number, decision: Decision): Pt =>
  p.part === "wave" ? funnelIntoArrow(p, t) : pulseAlongArrow(p, decision);
