import { ROLE_MS } from "../../constants";
import { seededRandom } from "../../math";
import { times } from "../../sequence";
import { COLS, ROWS, SUMMIT, type Cell, clampColumn, clampRow, heightAt } from "./heightMap";

export type Agent = { column: number; row: number; trail: Cell[] };

const MOVES: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const AGENT_COUNT = 18;
const MIN_START_DISTANCE = 18;
const SPAWN_TRIES = 20;
const STEP_MS = 90;
const TRAIL_LENGTH = 80;
const CLIMB_CHANCE = 0.92;
const [summitColumn, summitRow] = SUMMIT;

const distanceToSummit = (column: number, row: number) => Math.max(Math.abs(column - summitColumn), Math.abs(row - summitRow));

function spawnAgent(a: number): Agent {
  let column = 0, row = 0;
  for (let tries = 0; tries < SPAWN_TRIES; tries++) {
    column = Math.floor(seededRandom(a + tries * 7.1 + 0.5) * COLS);
    row = Math.floor(seededRandom(a * 3 + tries * 3.3 + 0.7) * ROWS);
    if (distanceToSummit(column, row) >= MIN_START_DISTANCE) break;
  }
  return { column, row, trail: [[column, row]] };
}

const spawn = () => times(AGENT_COUNT, spawnAgent);

function towardSummit(agent: Agent): Cell {
  const toColumn = summitColumn - agent.column, toRow = summitRow - agent.row;
  return [Math.sign(toColumn), Math.abs(toRow) * 2.5 > Math.abs(toColumn) ? Math.sign(toRow) : 0];
}

function uphill(agent: Agent): Cell {
  let best = -Infinity, move: Cell = [0, 0];
  for (const [dc, dr] of MOVES) {
    const column = clampColumn(agent.column + dc), row = clampRow(agent.row + dr);
    const moved = column !== agent.column || row !== agent.row;
    if (moved && heightAt(column, row) > best) {
      best = heightAt(column, row);
      move = [dc, dr];
    }
  }
  return move;
}

const anyDirection = () => MOVES[Math.floor(Math.random() * MOVES.length)];

function step(agent: Agent, drive: number) {
  const roll = Math.random();
  if (distanceToSummit(agent.column, agent.row) <= 1) return;
  const [dc, dr] = roll < drive ? towardSummit(agent) : roll < CLIMB_CHANCE ? uphill(agent) : anyDirection();
  agent.column = clampColumn(agent.column + dc);
  agent.row = clampRow(agent.row + dr);
  agent.trail.push([agent.column, agent.row]);
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
