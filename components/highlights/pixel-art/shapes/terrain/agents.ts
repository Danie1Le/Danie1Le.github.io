import { ROLE_MS } from "../../constants";
import { seededRandom } from "../../math";
import { times } from "../../sequence";
import { COLS, ROWS, SUMMIT, type Cell, heightAt, nudge } from "./heightMap";

export type Agent = { at: Cell; trail: Cell[] };

const MOVES: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const AGENT_COUNT = 18;
const MIN_START_DISTANCE = 18;
const SPAWN_TRIES = 20;
const STEP_MS = 90;
const TRAIL_LENGTH = 80;
const CLIMB_CHANCE = 0.92;
const [summitColumn, summitRow] = SUMMIT;

const distanceToSummit = ([column, row]: Cell) => Math.max(Math.abs(column - summitColumn), Math.abs(row - summitRow));

function spawnAgent(a: number): Agent {
  let column = 0, row = 0;
  for (let tries = 0; tries < SPAWN_TRIES; tries++) {
    column = Math.floor(seededRandom(a + tries * 7.1 + 0.5) * COLS);
    row = Math.floor(seededRandom(a * 3 + tries * 3.3 + 0.7) * ROWS);
    if (distanceToSummit([column, row]) >= MIN_START_DISTANCE) break;
  }
  const at: Cell = [column, row];
  return { at, trail: [at] };
}

const spawn = () => times(AGENT_COUNT, spawnAgent);

function towardSummit([column, row]: Cell): Cell {
  const toColumn = summitColumn - column, toRow = summitRow - row;
  return [Math.sign(toColumn), Math.abs(toRow) * 2.5 > Math.abs(toColumn) ? Math.sign(toRow) : 0];
}

function uphill(at: Cell): Cell {
  const [column, row] = at;
  let best = -Infinity, bestMove: Cell = [0, 0];
  for (const move of MOVES) {
    const next = nudge(at, move);
    const moved = next[0] !== column || next[1] !== row;
    if (moved && heightAt(next) > best) {
      best = heightAt(next);
      bestMove = move;
    }
  }
  return bestMove;
}

const anyDirection = () => MOVES[Math.floor(Math.random() * MOVES.length)];

function step(agent: Agent, drive: number) {
  const roll = Math.random();
  if (distanceToSummit(agent.at) <= 1) return;
  const move = roll < drive ? towardSummit(agent.at) : roll < CLIMB_CHANCE ? uphill(agent.at) : anyDirection();
  agent.at = nudge(agent.at, move);
  agent.trail.push(agent.at);
  if (agent.trail.length > TRAIL_LENGTH) agent.trail.shift();
}

const driveAt = (ms: number) => 0.45 + 0.45 * Math.min(1, ms / (ROLE_MS * 0.7));

export function createSwarm() {
  let agents: Agent[] = [], lastT = Infinity, lastStep = 0;
  return (t: number) => {
    const roleRestarted = t < lastT;
    if (roleRestarted) {
      agents = spawn();
      lastStep = 0;
    }
    lastT = t;
    for (; t - lastStep > STEP_MS; lastStep += STEP_MS) {
      const drive = driveAt(lastStep);
      for (const agent of agents) step(agent, drive);
    }
    return agents;
  };
}
