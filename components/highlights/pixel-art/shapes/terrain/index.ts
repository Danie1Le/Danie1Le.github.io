import type { Pt, Shape } from "../../types";
import { createSwarm } from "./agents";
import { COLS, ROWS, gx, gy, gz, hillshade } from "./grid";
import { drawBeacon, drawMesh, drawPaths } from "./overlay";

// Cognitive ABM, after the research poster: terrain from the diamond-square generator the research used, rough at
// every scale and full of peaks. The tallest carries a red beacon, the agents' goal; they wander and climb toward
// it, each leaving its path behind like a line on a graph, and most reach it by the end of the role.

export function terrain(): Shape {
  const pts: Pt[] = [];
  for (let j = 0; j < ROWS; j++)
    for (let i = 0; i < COLS; i++) pts.push({ x: gx(i), y: gy(i, j), z: gz(j), spin: true, a: hillshade(i, j) }); // slopes facing the light are bright
  const swarm = createSwarm();
  return {
    points: pts,
    yaw: () => 0, // a map doesn't turn; turning a flat map only throws its corners out of the frame
    tilt: 1.2, // a high view from above: reads as a map, with the peaks still rising out of it
    span: 4.3,
    half: 1.45,
    hill: true,
    over: (d) => {
      drawMesh(d);
      const agents = swarm(d.t);
      drawBeacon(d);
      drawPaths(d, agents);
    },
  };
}
