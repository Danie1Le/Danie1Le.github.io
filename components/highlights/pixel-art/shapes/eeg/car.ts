import { ease } from "../../math";
import { roll, roundBox, turn } from "../../surfaces";
import type { Pt } from "../../types";

// The team's RC car, in its own frame with the front to +x: a low body, a cab, a rear wing, an antenna and four big
// wheels. The wheels roll, and the front pair steers each time a decision arrives.

const CAR = [2.7, -0.02, 0.75], CAR_SIZE = 1.3; // where it sits in the scene, and how big
const WHEELS = [[0.6, -1], [0.6, 1], [-0.6, -1], [-0.6, 1]]; // [x, side] in the car's own frame (front is +x)
const WHEEL_Y = -0.2;

/** The car's pixels, in its own frame. */
export function carPoints(): Pt[] {
  const car: Pt[] = [];
  const inBody = (p: Pt) => Math.abs(p.x / 0.8) ** 3.2 + Math.abs(p.y / 0.17) ** 3.2 + Math.abs(p.z / 0.44) ** 3.2 < 0.97;
  car.push(...roundBox(400, [0, 0, 0], [0.8, 0.17, 0.44], 3.2, { g: "car" }));
  car.push(...roundBox(200, [-0.06, 0.17, 0], [0.38, 0.17, 0.32], 2.4, { g: "car", a: 0.75 }).filter((p) => !inBody(p)));
  WHEELS.forEach(([wx, s], w) => {
    const cz = s * 0.58, R = 0.33;
    for (let k = 0; k < 36; k++) for (let j = 0; j < 2; j++) { // tread, striped so the roll shows
      const u = (k / 36) * Math.PI * 2;
      car.push({ x: wx + Math.cos(u) * R, y: WHEEL_Y + Math.sin(u) * R, z: cz + (j - 0.5) * 0.14, spin: true, a: k % 4 < 2 ? 1.1 : 0.5, n: [Math.cos(u), Math.sin(u), 0], g: "wheel", w });
    }
    const face = (r: number, u: number, a: number) => car.push({ x: wx + Math.cos(u) * r, y: WHEEL_Y + Math.sin(u) * r, z: cz + s * 0.11, spin: true, a, n: [0, 0, s], g: "wheel", w });
    for (let k = 0; k < 22; k++) face(0.2, (k / 22) * Math.PI * 2, 1.2); // rim
    for (let k = 0; k < 5; k++) for (let j = 0; j < 3; j++) face(0.05 + j * 0.055, (k / 5) * Math.PI * 2, 1); // spokes
  });
  for (let k = 0; k < 48; k++) car.push({ x: -0.88 + (k % 4) * 0.06, y: 0.34, z: -0.46 + Math.floor(k / 4) * 0.084, spin: true, a: 1.2, n: [0, 1, 0], g: "car" }); // rear wing
  for (const z of [-0.22, 0.22]) for (let j = 0; j < 6; j++) car.push({ x: -0.79, y: 0.14 + j * 0.035, z, spin: true, a: 1.2, g: "car" }); // its posts
  for (let j = 0; j < 16; j++) car.push({ x: -0.55 - j * 0.008, y: 0.14 + j * 0.042, z: -0.28, spin: true, a: 1.2, g: "car" }); // antenna
  for (let j = 0; j < 4; j++) car.push({ x: -0.68 + (j % 2) * 0.03, y: 0.82 + Math.floor(j / 2) * 0.03, z: -0.28, spin: true, red: true, g: "tip" });
  for (const z of [-0.3, 0.3]) for (let j = 0; j < 6; j++) { // headlights, and red tail lights
    car.push({ x: 0.8, y: 0.01 + Math.floor(j / 3) * 0.035, z: z + (j % 3) * 0.035, spin: true, a: 2, n: [1, 0, 0], g: "car" });
    if (j < 4) car.push({ x: -0.8, y: 0.02 + Math.floor(j / 2) * 0.035, z: z + (j % 2) * 0.035, spin: true, red: true, g: "car" });
  }
  return car;
}

/** A car pixel this frame. `n` counts the decisions so far; `beat` is how far (0-1) the current one has travelled. */
export function moveCar(p: Pt, t: number, n: number, beat: number): Pt {
  let q = p;
  if (p.g === "wheel") {
    const [wx, s] = WHEELS[p.w!];
    q = roll(q, -t / 160, wx, WHEEL_Y);
    if (wx > 0) { // front wheels steer the way the last decision said, easing over (no flicker)
      const side = (k: number) => (k % 2 ? 0.34 : -0.34);
      q = turn(q, side(n - 1) + (side(n) - side(n - 1)) * ease(Math.min(1, beat / 0.3)), wx, s * 0.6);
    }
  }
  if (p.g === "tip") q = { ...q, a: beat < 0.2 ? 2.4 : 1 }; // the antenna flashes as each decision arrives
  q = turn(q, 0.55 + 0.12 * Math.sin(t / 1600), 0, 0); // a three-quarter view, swaying a little
  return { ...q, x: q.x * CAR_SIZE + CAR[0], y: q.y * CAR_SIZE + CAR[1], z: q.z * CAR_SIZE + CAR[2] };
}
