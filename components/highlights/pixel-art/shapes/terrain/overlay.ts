import type { Draw } from "../../types";
import type { Agent } from "./agents";
import { COLS, ROWS, SUMMIT, gx, gy, gz } from "./grid";

// What's drawn over the map's pixels: its mesh, the goal's beacon, and the agents' paths.

/** Screen position of a grid cell, just above the ground. */
const cell = ({ project }: Draw, i: number, j: number) => project(gx(i), gy(i, j) + 0.03, gz(j));

/** The surface mesh, through the pixels themselves (every other row). */
export function drawMesh({ ctx, sx, sy, settle, ink, size }: Draw) {
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, size * 0.3);
  ctx.globalAlpha = 0.08 * settle;
  ctx.beginPath();
  for (let j = 0; j < ROWS; j += 2) for (let i = 0; i < COLS; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, sx[j * COLS + i], sy[j * COLS + i]);
  ctx.stroke();
}

/** The goal: a red flag on the summit, with a ring rippling out from it. */
export function drawBeacon(d: Draw) {
  const { ctx, t, settle, project, red, size } = d;
  const [bx, by] = cell(d, SUMMIT[0], SUMMIT[1]), [, topY] = project(gx(SUMMIT[0]), gy(SUMMIT[0], SUMMIT[1]) + 0.9, gz(SUMMIT[1]));
  const ripple = (t % 1400) / 1400;
  const ring = (rr: number, alpha: number) => {
    ctx.globalAlpha = settle * alpha;
    ctx.beginPath();
    for (let k = 0; k <= 32; k++) {
      const u = (k / 32) * Math.PI * 2;
      const [x, y] = project(gx(SUMMIT[0]) + Math.cos(u) * rr, gy(SUMMIT[0], SUMMIT[1]), gz(SUMMIT[1]) + Math.sin(u) * rr);
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  };
  ctx.strokeStyle = red;
  ctx.lineWidth = Math.max(1.5, size * 0.6);
  ring(0.2, 0.9);
  ring(0.2 + 0.5 * ripple, 1 - ripple);
  ctx.globalAlpha = settle;
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, topY); ctx.stroke(); // the pole
  ctx.fillStyle = red;
  const f = size * 4.2;
  ctx.beginPath(); ctx.moveTo(bx, topY); ctx.lineTo(bx + f * 1.6, topY + f * 0.55); ctx.lineTo(bx, topY + f * 1.1); ctx.fill(); // its flag
}

/** The agents' paths, fading toward their oldest steps, and each agent's current square. */
export function drawPaths(d: Draw, agents: Agent[]) {
  const { ctx, settle, red, size } = d;
  ctx.strokeStyle = red;
  ctx.fillStyle = red;
  ctx.lineWidth = Math.max(1.5, size * 0.7);
  ctx.lineJoin = "round";
  [0.15, 0.3, 0.5, 0.8].forEach((alpha, q) => {
    ctx.globalAlpha = alpha * settle;
    ctx.beginPath();
    for (const { trail } of agents) {
      const from = Math.floor((q * trail.length) / 4), to = Math.min(trail.length - 1, Math.floor(((q + 1) * trail.length) / 4));
      for (let n = from; n <= to; n++) { const [x, y] = cell(d, trail[n][0], trail[n][1]); n > from ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    }
    ctx.stroke();
  });
  ctx.globalAlpha = settle;
  for (const ag of agents) { const [x, y] = cell(d, ag.i, ag.j), s = size * 2.6; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
}
