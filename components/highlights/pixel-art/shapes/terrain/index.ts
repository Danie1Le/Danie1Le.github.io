import type { Pt, Shape } from "../../types";
import { createSwarm } from "./agents";
import { COLS, ROWS, columnX, heightAt, hillshade, rowZ } from "./grid";
import { drawBeacon, drawMesh, drawPaths } from "./overlay";

function mapPoints(): Pt[] {
  const pts: Pt[] = [];
  for (let j = 0; j < ROWS; j++)
    for (let i = 0; i < COLS; i++) pts.push({ x: columnX(i), y: heightAt(i, j), z: rowZ(j), brightness: hillshade(i, j) });
  return pts;
}

export function terrain(): Shape {
  const swarm = createSwarm();
  return {
    points: mapPoints(),
    yaw: () => 0,
    tilt: () => 1.2,
    halfWidth: 4.3,
    halfHeight: 1.45,
    hillshaded: true,
    drawInFront: (d) => {
      drawMesh(d);
      const agents = swarm(d.t);
      drawBeacon(d);
      drawPaths(d, agents);
    },
  };
}
