import { grid } from "../../sequence";
import type { Pt, Shape } from "../../types";
import { createSwarm } from "./agents";
import { COLS, ROWS, columnX, heightAt, hillshade, rowZ } from "./heightMap";
import { drawBeacon, drawMesh, drawPaths } from "./overlay";

const mapPoints = (): Pt[] =>
  grid(COLS, ROWS, (i, j) => ({ x: columnX(i), y: heightAt(i, j), z: rowZ(j), brightness: hillshade(i, j) }));

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
