import { ROLE_MS } from "../../constants";
import { rnd } from "../../math";
import { COLS, ROWS, SUMMIT, gy } from "./grid";

// The agents: they wander, climb, and head more and more for the summit, as later generations do in the research.

export type Agent = { i: number; j: number; trail: number[][] }; // grid cell now, and the cells it came through

const MOVES = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]; // eight ways, so paths run like graph lines
const STEP_MS = 90; // agents take a step this often
const clampI = (i: number) => Math.max(0, Math.min(COLS - 1, i)), clampJ = (j: number) => Math.max(0, Math.min(ROWS - 1, j));

/** 18 agents, each starting well away from the goal. */
const spawn = (): Agent[] =>
  Array.from({ length: 18 }, (_, a) => {
    let i = 0, j = 0;
    for (let tries = 0; tries < 20; tries++) {
      [i, j] = [Math.floor(rnd(a + tries * 7.1 + 0.5) * COLS), Math.floor(rnd(a * 3 + tries * 3.3 + 0.7) * ROWS)];
      if (Math.max(Math.abs(i - SUMMIT[0]), Math.abs(j - SUMMIT[1])) >= 18) break;
    }
    return { i, j, trail: [[i, j]] };
  });

/** One step for one agent. `drive` is how likely it is to head straight for the goal. */
function step(ag: Agent, drive: number) {
  const gi = SUMMIT[0] - ag.i, gj = SUMMIT[1] - ag.j, r = Math.random();
  let [di, dj] = [0, 0];
  if (Math.max(Math.abs(gi), Math.abs(gj)) <= 1) return; // arrived: it stays on the summit
  if (r < drive) [di, dj] = [Math.sign(gi), Math.abs(gj) * 2.5 > Math.abs(gi) ? Math.sign(gj) : 0]; // toward the goal
  else if (r < 0.92) { // otherwise climb: the highest neighbouring cell
    let best = -Infinity;
    for (const [mi, mj] of MOVES) {
      const i = clampI(ag.i + mi), j = clampJ(ag.j + mj);
      if ((i !== ag.i || j !== ag.j) && gy(i, j) > best) { best = gy(i, j); [di, dj] = [mi, mj]; }
    }
  } else [di, dj] = MOVES[Math.floor(Math.random() * MOVES.length)];
  ag.i = clampI(ag.i + di); ag.j = clampJ(ag.j + dj);
  ag.trail.push([ag.i, ag.j]);
  if (ag.trail.length > 80) ag.trail.shift();
}

/**
 * A swarm that follows the role's clock: call it with `t` each frame and it returns the agents as of then.
 * A fresh population starts each time the role comes up (t goes back). The walk catches up to `t` in fixed steps,
 * so a still frame (reduced motion) shows the finished paths.
 */
export function createSwarm() {
  let agents: Agent[] = [], lastT = Infinity, lastStep = 0;
  return (t: number) => {
    if (t < lastT) { agents = spawn(); lastStep = 0; }
    lastT = t;
    for (; t - lastStep > STEP_MS; lastStep += STEP_MS) {
      const drive = 0.45 + 0.45 * Math.min(1, lastStep / (ROLE_MS * 0.7)); // later generations head for the goal more
      for (const ag of agents) step(ag, drive);
    }
    return agents;
  };
}
