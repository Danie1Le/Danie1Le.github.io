import { around, grid, smoothstep, times, type Vec3 } from "../../math";
import { inRoundBox, placeAt, roll, roundBox, turn } from "../../surfaces";
import type { Pt } from "../../types";
import { redSquare } from "../redSquare";

const CAR_POSITION = [2.7, -0.02, 0.75];
const CAR_SCALE = 1.3;
const BODY_RADII: Vec3 = [0.8, 0.17, 0.44];
const BODY_ROUNDNESS = 3.2;
const WHEELS = [{ x: 0.6, side: -1 }, { x: 0.6, side: 1 }, { x: -0.6, side: -1 }, { x: -0.6, side: 1 }];
const AXLE_Y = -0.2;
const WHEEL_RADIUS = 0.33;
const RIM_RADIUS = 0.2;
const STEER_ANGLE = 0.34;
const STEER_EASE_SHARE = 0.3;
const ANTENNA_FLASH_SHARE = 0.2;

const body = () => roundBox(400, [0, 0, 0], BODY_RADII, BODY_ROUNDNESS, { part: "car" });

const cab = () =>
  roundBox(200, [-0.06, 0.17, 0], [0.38, 0.17, 0.32], 2.4, { part: "car", brightness: 0.75 }).filter((p) => !inRoundBox(p, BODY_RADII, BODY_ROUNDNESS));

function wheel({ x: wheelX, side }: (typeof WHEELS)[number], index: number): Pt[] {
  const hubZ = side * 0.58;
  const onWheel = { part: "wheel" as const, partIndex: index };
  const tread = around(36, (angle, k) =>
    times(2, (j): Pt => ({
      x: wheelX + Math.cos(angle) * WHEEL_RADIUS,
      y: AXLE_Y + Math.sin(angle) * WHEEL_RADIUS,
      z: hubZ + (j - 0.5) * 0.14,
      brightness: k % 4 < 2 ? 1.1 : 0.5,
      normal: [Math.cos(angle), Math.sin(angle), 0],
      ...onWheel,
    }))
  ).flat();
  const onFace = (radius: number, angle: number, brightness: number): Pt => ({
    x: wheelX + Math.cos(angle) * radius,
    y: AXLE_Y + Math.sin(angle) * radius,
    z: hubZ + side * 0.11,
    brightness,
    normal: [0, 0, side],
    ...onWheel,
  });
  const rim = around(22, (angle) => onFace(RIM_RADIUS, angle, 1.2));
  const spokes = around(5, (angle) => times(3, (j) => onFace(0.05 + j * 0.055, angle, 1))).flat();
  return [...tread, ...rim, ...spokes];
}

const rearWing = () =>
  grid(4, 12, (column, row): Pt => ({ x: -0.88 + column * 0.06, y: 0.34, z: -0.46 + row * 0.084, brightness: 1.2, normal: [0, 1, 0], part: "car" }));

const wingPosts = () =>
  [-0.22, 0.22].flatMap((z) => times(6, (j): Pt => ({ x: -0.79, y: 0.14 + j * 0.035, z, brightness: 1.2, part: "car" })));

const antenna = (): Pt[] => [
  ...times(16, (j): Pt => ({ x: -0.55 - j * 0.008, y: 0.14 + j * 0.042, z: -0.28, brightness: 1.2, part: "car" })),
  ...redSquare(-0.68, 0.82, -0.28, { part: "tip" }),
];

const headlightPixel = (j: number, z: number): Pt =>
  ({ x: 0.8, y: 0.01 + Math.floor(j / 3) * 0.035, z: z + (j % 3) * 0.035, brightness: 2, normal: [1, 0, 0], part: "car" });

const tailLightPixel = (j: number, z: number): Pt =>
  ({ x: -0.8, y: 0.02 + Math.floor(j / 2) * 0.035, z: z + (j % 2) * 0.035, red: true, part: "car" });

function lights(): Pt[] {
  const pts: Pt[] = [];
  for (const z of [-0.3, 0.3]) for (let j = 0; j < 6; j++) {
    pts.push(headlightPixel(j, z));
    if (j < 4) pts.push(tailLightPixel(j, z));
  }
  return pts;
}

export const carPoints = (): Pt[] =>
  [...body(), ...cab(), ...WHEELS.flatMap(wheel), ...rearWing(), ...wingPosts(), ...antenna(), ...lights()];

const steerFor = (decision: number) => (decision % 2 ? STEER_ANGLE : -STEER_ANGLE);

const steering = (decisionsSoFar: number, decisionProgress: number) => {
  const from = steerFor(decisionsSoFar - 1), to = steerFor(decisionsSoFar);
  return from + (to - from) * smoothstep(Math.min(1, decisionProgress / STEER_EASE_SHARE));
};

function turnWheel(p: Pt, t: number, decisionsSoFar: number, decisionProgress: number): Pt {
  const { x: wheelX, side } = WHEELS[p.partIndex!];
  const rolled = roll(p, -t / 160, wheelX, AXLE_Y);
  const isFrontWheel = wheelX > 0;
  return isFrontWheel ? turn(rolled, steering(decisionsSoFar, decisionProgress), wheelX, side * 0.6) : rolled;
}

const flashAntenna = (p: Pt, decisionProgress: number): Pt => ({ ...p, brightness: decisionProgress < ANTENNA_FLASH_SHARE ? 2.4 : 1 });

export function moveCar(p: Pt, t: number, decisionsSoFar: number, decisionProgress: number): Pt {
  let q = p;
  if (p.part === "wheel") q = turnWheel(q, t, decisionsSoFar, decisionProgress);
  if (p.part === "tip") q = flashAntenna(q, decisionProgress);
  const threeQuarterView = turn(q, 0.55 + 0.12 * Math.sin(t / 1600), 0, 0);
  return placeAt(threeQuarterView, CAR_POSITION, CAR_SCALE);
}
