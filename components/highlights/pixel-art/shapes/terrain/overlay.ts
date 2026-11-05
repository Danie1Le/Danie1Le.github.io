import { fillSquare, tracePath } from "../../canvas";
import { TAU } from "../../math";
import { spread, times } from "../../sequence";
import type { Draw } from "../../types";
import type { Agent } from "./agents";
import { COLS, ROWS, SUMMIT, columnX, heightAt, rowZ } from "./heightMap";

const ABOVE_GROUND = 0.03;
const FLAG_POLE_HEIGHT = 0.9;
const RIPPLE_MS = 1400;
const RING_RADIUS = 0.2;
const RIPPLE_SPREAD = 0.5;
const RING_SEGMENTS = 32;
const TRAIL_FADE = [0.15, 0.3, 0.5, 0.8];

const cell = ({ project }: Draw, i: number, j: number) => project(columnX(i), heightAt(i, j) + ABOVE_GROUND, rowZ(j));

export function drawMesh({ ctx, screenX, screenY, formed, ink, pixelSize }: Draw) {
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, pixelSize * 0.3);
  ctx.globalAlpha = 0.08 * formed;
  ctx.beginPath();
  for (let j = 0; j < ROWS; j += 2) tracePath(ctx, times(COLS, (i) => ({ x: screenX[j * COLS + i], y: screenY[j * COLS + i] })));
  ctx.stroke();
}

export function drawBeacon(d: Draw) {
  const { ctx, t, formed, project, red, pixelSize } = d;
  const [summitColumn, summitRow] = SUMMIT;
  const summitX = columnX(summitColumn), summitY = heightAt(summitColumn, summitRow), summitZ = rowZ(summitRow);
  const base = cell(d, summitColumn, summitRow), top = project(summitX, summitY + FLAG_POLE_HEIGHT, summitZ);
  const ripple = (t % RIPPLE_MS) / RIPPLE_MS;

  const ring = (radius: number, alpha: number) => {
    ctx.globalAlpha = formed * alpha;
    ctx.beginPath();
    tracePath(ctx, spread(RING_SEGMENTS + 1, (fraction) => {
      const angle = fraction * TAU;
      return project(summitX + Math.cos(angle) * radius, summitY, summitZ + Math.sin(angle) * radius);
    }));
    ctx.stroke();
  };

  const pole = () => {
    ctx.globalAlpha = formed;
    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(base.x, top.y);
    ctx.stroke();
  };

  const flag = () => {
    const size = pixelSize * 4.2;
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(base.x, top.y);
    ctx.lineTo(base.x + size * 1.6, top.y + size * 0.55);
    ctx.lineTo(base.x, top.y + size * 1.1);
    ctx.fill();
  };

  ctx.strokeStyle = red;
  ctx.lineWidth = Math.max(1.5, pixelSize * 0.6);
  ring(RING_RADIUS, 0.9);
  ring(RING_RADIUS + RIPPLE_SPREAD * ripple, 1 - ripple);
  pole();
  flag();
}

function trailSlice(trail: number[][], quarter: number) {
  const from = Math.floor((quarter * trail.length) / 4);
  const to = Math.min(trail.length - 1, Math.floor(((quarter + 1) * trail.length) / 4));
  return trail.slice(from, to + 1);
}

export function drawPaths(d: Draw, agents: Agent[]) {
  const { ctx, formed, red, pixelSize } = d;
  ctx.strokeStyle = red;
  ctx.fillStyle = red;
  ctx.lineWidth = Math.max(1.5, pixelSize * 0.7);
  ctx.lineJoin = "round";
  TRAIL_FADE.forEach((alpha, quarter) => {
    ctx.globalAlpha = alpha * formed;
    ctx.beginPath();
    for (const { trail } of agents) tracePath(ctx, trailSlice(trail, quarter).map(([i, j]) => cell(d, i, j)));
    ctx.stroke();
  });
  ctx.globalAlpha = formed;
  for (const agent of agents) {
    const { x, y } = cell(d, agent.column, agent.row);
    fillSquare(ctx, x, y, pixelSize * 2.6);
  }
}
