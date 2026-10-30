"use client"

import { highlights } from "@/lib/content";
import { useEffect, useRef, useState } from "react";

const ROLE_MS = 7000; // each role holds this long before the loader hands on to the next
const N = 2400; // pixels in the picture; every role's shape is made of the same pixels, so they morph between roles

// ---------- Shapes: where each pixel rests for a role (model units, y up, about ±1 tall) ----------

type Pt = { x: number; y: number; z: number; red?: boolean; spin?: boolean; flag?: boolean; a?: number; n?: number[]; g?: string; w?: number }; // a = brightness (>1 = contour); n = surface direction, lit live; g, w = part and index, for shapes that move their parts
type Draw = {
  ctx: CanvasRenderingContext2D; W: number; H: number; t: number;
  settle: number; // 0 → 1 once the pixels have formed the shape; overlays fade in with it
  sx: Float32Array; sy: Float32Array; // where each pixel landed on screen this frame
  project: (x: number, y: number, z: number) => number[]; // model → [screen x, screen y, perspective]
  ink: string; red: string; size: number;
};
type Shape = {
  points: Pt[];
  yaw: (t: number) => number; // turn about the vertical axis; t = ms since the role began
  tilt: number | ((t: number) => number); // look-down angle
  span: number; // half-width in model units, so narrow screens can shrink the shape to fit
  half?: number; // half-height in model units (default 1), so tall shapes keep a margin
  glow?: number; // hologram bloom, 0-1
  hill?: boolean; // `a` is hillshade light, so a light ground shows it as printed shadow
  live?: (p: Pt, i: number, t: number) => Pt; // per-frame movement
  under?: (d: Draw) => void; // drawn behind the pixels
  over?: (d: Draw) => void; // drawn on top of them
};

const rnd = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const ease = (k: number) => k * k * (3 - 2 * k);
const fit = (pts: Pt[]) => Array.from({ length: N }, (_, i) => pts[Math.floor((i * pts.length) / N)]); // even up- or down-sampling to N

// Evenly spread points on an ellipsoid's surface (Fibonacci sphere).
const ellipsoid = (n: number, c: number[], r: number[], extra: Partial<Pt> = {}): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
    return { x: c[0] + Math.cos(th) * rr * r[0], y: c[1] + y * r[1], z: c[2] + Math.sin(th) * rr * r[2], spin: true, ...extra };
  });

// Framatome: five engineering documents; a scan runs down them and the pages with page-number errors flag red.
function pages(): Shape {
  const pts: Pt[] = [], w = 1.1, h = 1.44;
  for (let p = 0; p < 5; p++) {
    const cx = (p - 2) * 1.55, flagged = p === 1 || p === 3;
    for (let j = 0; j < 90; j++) { // page outline
      let d = (j / 90) * 2 * (w + h), x, y;
      if (d < w) [x, y] = [-w / 2 + d, h / 2];
      else if ((d -= w) < h) [x, y] = [w / 2, h / 2 - d];
      else if ((d -= h) < w) [x, y] = [w / 2 - d, -h / 2];
      else [x, y] = [-w / 2, -h / 2 + d - w];
      pts.push({ x: cx + x, y, z: 0, spin: true });
    }
    for (let j = 0; j < 160; j++) { // eight lines of text
      const l = Math.floor(j / 20), len = 0.8 - (l % 3) * 0.16;
      pts.push({ x: cx - 0.4 + ((j % 20) / 19) * len, y: 0.5 - l * 0.13, z: 0, spin: true });
    }
    for (let j = 0; j < 30; j++) // the page number
      pts.push({ x: cx - 0.1 + (j % 10) * 0.022, y: -0.6 + Math.floor(j / 10) * 0.03, z: 0, spin: true, flag: flagged });
  }
  return {
    points: fit(pts),
    yaw: (t) => 0.24 * Math.sin(t / 1800),
    tilt: 0.1,
    span: 4.7, // room for the nearest page, which grows in perspective as the stack turns toward the viewer
    // The scan line passes the page numbers about two-thirds of the way through the role, then runs off the page.
    live: (p, _i, t) => {
      const scan = 0.8 - 1.75 * Math.min(1, t / (ROLE_MS * 0.75));
      return { ...p, red: (p.flag && scan < -0.55) || Math.abs(p.y - scan) < 0.035 };
    },
  };
}

// ---------- Shared surface helpers ----------

const gs = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));
const unit = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return v.map((c) => c / l); };
const inEllipsoid = (p: Pt, c: number[], r: number[]) => ((p.x - c[0]) / r[0]) ** 2 + ((p.y - c[1]) / r[1]) ** 2 + ((p.z - c[2]) / r[2]) ** 2 < 0.97;
// Points on an ellipsoid that pass `keep`, each with its outward surface direction.
const shell = (n: number, c: number[], r: number[], keep: (p: Pt) => boolean): Pt[] =>
  ellipsoid(n, c, r).filter(keep).map((p) => ({ ...p, n: unit([(p.x - c[0]) / r[0] ** 2, (p.y - c[1]) / r[1] ** 2, (p.z - c[2]) / r[2] ** 2]) }));
// A rounded box (a superellipsoid: exponent 2 is an ellipsoid, higher is boxier), with surface directions.
const roundBox = (n: number, c: number[], r: number[], p: number, extra: Partial<Pt> = {}): Pt[] =>
  ellipsoid(n, [0, 0, 0], [1, 1, 1]).map(({ x, y, z }) => {
    const k = (Math.abs(x / r[0]) ** p + Math.abs(y / r[1]) ** p + Math.abs(z / r[2]) ** p) ** (-1 / p);
    const g = (v: number, rr: number) => (Math.sign(v) * Math.abs(v / rr) ** (p - 1)) / rr;
    return { x: c[0] + x * k, y: c[1] + y * k, z: c[2] + z * k, spin: true, n: unit([g(x * k, r[0]), g(y * k, r[1]), g(z * k, r[2])]), ...extra };
  });
// Turn a point and its surface direction about a vertical axis through (cx, cz), the same way the camera's yaw turns.
const turn = (p: Pt, ang: number, cx: number, cz: number): Pt => {
  const c = Math.cos(ang), s = Math.sin(ang), x = p.x - cx, z = p.z - cz;
  return { ...p, x: cx + x * c + z * s, z: cz - x * s + z * c, n: p.n && [p.n[0] * c + p.n[2] * s, p.n[1], -p.n[0] * s + p.n[2] * c] };
};
// Roll a point about a horizontal (front-to-back) axis through (cx, cy), the way a wheel turns.
const roll = (p: Pt, ang: number, cx: number, cy: number): Pt => {
  const c = Math.cos(ang), s = Math.sin(ang), x = p.x - cx, y = p.y - cy;
  return { ...p, x: cx + x * c - y * s, y: cy + x * s + y * c, n: p.n && [p.n[0] * c - p.n[1] * s, p.n[0] * s + p.n[1] * c, p.n[2]] };
};
const hash = (i: number, j: number) => rnd(i * 57.13 + j * 131.71);
const vnoise = (x: number, z: number) => {
  const i = Math.floor(x), j = Math.floor(z), u = ease(x - i), v = ease(z - j);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

// EEG research: the brain, seen from the side, wears eight electrodes. Their channels stream right and funnel into an
// arrow that drives the team's RC car: each pulse down the arrow is one decision, and the car's front wheels steer.
const BRAIN = [-3.05, 0.12, 0.35], CAR = [2.7, -0.02, 0.75], CAR_SIZE = 1.3; // where each sits in the scene
const PULSE = 1400; // ms per decision
const WHEELS = [[0.6, -1], [0.6, 1], [-0.6, -1], [-0.6, 1]]; // [x, side] in the car's own frame (front is +x)
const WHEEL_Y = -0.2;
const segDist = (x: number, y: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax, dy = by - ay, k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - ax - k * dx, y - ay - k * dy);
};
// Brightness across the cortex: winding folds with dark grooves between them, plus the brain's landmarks: the lateral
// fissure above the temporal lobe, the central sulcus over the top, and the cleft between the hemispheres.
const fold = (x: number, y: number, z: number) => // -1 (groove) … 1 (crest), winding across the surface
  Math.sin(8.5 * (vnoise(x * 4.4 + z * 2.8 + 5, y * 4.6 - z * 2.2) + 0.6 * vnoise(z * 5.8 - y * 3, x * 5.5 + 1)));
// Is this point on one of the drawn lines: a fold's edge, the lateral fissure or the central sulcus?
const onLine = (x: number, y: number, z: number) =>
  Math.abs(fold(x, y, z)) < 0.14
  || (segDist(x, y, 0.66, -0.1, -0.3, 0.1) < 0.018 && Math.abs(z) > 0.2)
  || (segDist(x, y, 0.0, 0.76, 0.36, -0.02) < 0.016 && Math.abs(z) > 0.05);
// The folds also push the surface in and out, so the brain's outline is lumpy like a real one.
const lumpy = (p: Pt, c: number[]): Pt => {
  const k = 1 + 0.05 * fold(p.x, p.y, p.z);
  return { ...p, x: c[0] + (p.x - c[0]) * k, y: c[1] + (p.y - c[1]) * k, z: c[2] + (p.z - c[2]) * k };
};
function eeg(): Shape {
  // The brain, front (frontal lobe) to the right, in its own frame.
  const CC = [0, 0.1, 0], CR = [0.95, 0.62, 0.6]; // cerebrum, with a flatter underside
  const squash = (y: number, k: number) => (y < CC[1] ? CC[1] + (y - CC[1]) * k : y);
  const inCerebrum = (p: Pt) => inEllipsoid({ ...p, y: squash(p.y, 1 / 0.72) }, CC, CR);
  const TC = [0.22, -0.2, 0], TR = [0.56, 0.22, 0.54]; // temporal lobe
  const KC = [-0.6, -0.33, 0], KR = [0.36, 0.2, 0.46]; // cerebellum
  // The cortex as a line drawing: a dim shell for the volume, with its folds traced in bright winding lines
  // (points kept from a dense scatter only where they fall on a line, so the lines come out continuous).
  const cortex = (n: number, k: number) => [
    ...shell(n, CC, CR, () => true)
      .map((p) => ({ ...p, y: squash(p.y, 0.72), n: unit([p.n![0], p.n![1] / (p.y < CC[1] ? 0.72 : 1), p.n![2]]) }))
      .filter((p) => !inEllipsoid(p, TC, TR))
      .map((p) => lumpy(p, CC)),
    ...shell(Math.round(n * k), TC, TR, (p) => !inCerebrum(p)).map((p) => lumpy(p, TC)),
  ];
  // Lines only on the side that faces the viewer (the brain never turns far), drawn evenly bright rather than lit.
  const lines = cortex(16000, 0.3).filter((p) => p.z < 0.12 && onLine(p.x, p.y, p.z));
  const brain: Pt[] = [
    ...cortex(300, 0.3).map((p) => ({ ...p, a: 0.3 })),
    ...lines.filter((_, i) => i % Math.max(1, Math.round(lines.length / 640)) === 0).map(({ n: _n, ...p }) => ({ ...p, a: 1.5 })),
  ];
  brain.push(...shell(160, KC, KR, (p) => !inCerebrum(p)).map((p) => ({ ...p, a: 0.3 + 0.9 * Math.abs(Math.sin((p.y - 0.35 * p.x) * 40)) }))); // its fine stripes
  for (let j = 0; j < 70; j++) { // brainstem
    const u = j * 2.399963, k = j / 70, p = { x: -0.2 + 0.08 * k + Math.cos(u) * 0.11, y: -0.24 - k * 0.58, z: Math.sin(u) * 0.11 };
    if (!inCerebrum({ ...p }) && !inEllipsoid(p, KC, KR)) brain.push({ ...p, spin: true, a: 0.7, n: [Math.cos(u), 0, Math.sin(u)] });
  }
  for (let e = 0; e < 8; e++) { // the eight electrodes, across the top
    const x = -0.62 + e * 0.177, z = (e % 2 ? 1 : -1) * 0.24;
    const y = CC[1] + CR[1] * Math.sqrt(Math.max(0, 1 - (x / CR[0]) ** 2 - (z / CR[2]) ** 2)) + 0.05;
    for (let j = 0; j < 4; j++) brain.push({ x: x + (j % 2) * 0.03, y: y + Math.floor(j / 2) * 0.03, z, spin: true, red: true });
  }

  // Eight channels of signal, flat on the screen, and the arrow they feed.
  const flat: Pt[] = [];
  for (let c = 0; c < 8; c++) for (let j = 0; j < 36; j++) flat.push({ x: -2.0 + (j / 35) * 1.8, y: 0.49 - c * 0.14, z: 0, w: c, g: "wave" });
  for (let j = 0; j < 26; j++) flat.push({ x: -0.15 + j * 0.04, y: 0, z: 0, g: "arrow" });
  for (const s of [1, -1]) for (let j = 1; j <= 8; j++) flat.push({ x: 0.85 - j * 0.03, y: s * j * 0.028, z: 0, g: "arrow" });

  // The RC car in its own frame, front to +x: a low body, a cab, a rear wing, an antenna and four big wheels.
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

  return {
    points: fit([...brain.map((p) => ({ ...p, g: "brain" })), ...flat, ...car]),
    yaw: () => 0, // the scene stays put; the brain and the car each turn on their own spot
    tilt: 0.2,
    span: 4.55,
    half: 1.05,
    live: (p, _i, t) => {
      const beat = (t % PULSE) / PULSE, n = Math.floor(t / PULSE);
      if (p.g === "wave") { // the channels run left to right and funnel into the arrow
        const u = (p.x + 2) / 1.8, pull = 0.9 * ease(u) ** 1.5, c = p.w!;
        const wave = 0.04 * Math.sin(p.x * (8 + c) - t / 140 + c * 1.7) + 0.022 * Math.sin(p.x * (21 + 2 * c) - t / 85 + c);
        return { ...p, y: p.y * (1 - pull) + wave * (1 - 0.6 * pull) };
      }
      if (p.g === "arrow") return { ...p, red: Math.abs(p.x - (-0.2 + beat * 1.2)) < 0.12 }; // a decision travels down it
      if (p.g === "brain") {
        const q = turn(p, -0.2 + 0.45 * Math.sin(t / 2000), 0, 0);
        return { ...q, x: q.x + BRAIN[0], y: q.y + BRAIN[1], z: q.z + BRAIN[2] };
      }
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
    },
  };
}

// The ResVR face's relief: brow, eye sockets, nose, cheekbones, lips and chin, pressed into the front of head().
const faceDepth = (x: number, y: number) => {
  const ax = Math.abs(x);
  return 0.5 * Math.sqrt(Math.max(0, 1 - (x / 0.85) ** 2)) // the curve of the face
    + 0.07 * gs(y - 0.36, 0.06) * gs(ax - 0.28, 0.2) // brow ridge
    - 0.13 * gs(ax - 0.3, 0.12) * gs(y - 0.2, 0.08) // eye sockets
    + 0.07 * gs(ax - 0.3, 0.07) * gs(y - 0.2, 0.045) // eyes
    + 0.26 * gs(x, 0.07 + 0.05 * Math.max(0, -y)) * gs(y + 0.06, 0.17) // nose bridge
    + 0.1 * gs(x, 0.09) * gs(y + 0.25, 0.06) // nose tip
    + 0.05 * gs(ax - 0.11, 0.05) * gs(y + 0.28, 0.04) // nostrils
    + 0.05 * gs(ax - 0.45, 0.14) * gs(y + 0.02, 0.12) // cheekbones
    + 0.07 * gs(x, 0.2) * gs(y + 0.47, 0.035) // upper lip
    + 0.08 * gs(x, 0.18) * gs(y + 0.57, 0.04) // lower lip
    - 0.05 * gs(x, 0.22) * gs(y + 0.515, 0.012) // mouth line
    + 0.08 * gs(x, 0.18) * gs(y + 0.85, 0.1); // chin
};
const faceHalfWidth = (y: number) => 0.78 * (1 - (y < 0 ? 0.3 : 0.12) * (y / 1.1) ** 2); // narrower at the chin
// The relief on its own: faceDepth without its overall curve, faded out toward the face's edge, deepened to read front-on.
const relief = (x: number, y: number) => {
  const e = (x / faceHalfWidth(y)) ** 2 + (y / 1.1) ** 2;
  return e < 1 ? 1.35 * (faceDepth(x, y) - 0.5 * Math.sqrt(Math.max(0, 1 - (x / 0.85) ** 2))) * (1 - e ** 3) : 0;
};

// ResVR: a human head as a hologram, built like a contour model from horizontal slices. Each slice is a rounded
// outline whose width, front and back follow a real head's profile: a domed crown, flat sides, a square jaw angle
// under the ears, then a jawline narrowing to a squared chin. The face's relief is pressed into the front.
const HY = [1.17, 1.13, 1.05, 0.85, 0.55, 0.25, 0, -0.25, -0.45, -0.6, -0.8, -0.95, -1.04]; // slice heights, crown to chin
const profile = (vs: number[]) => (y: number) => { // a smooth curve (Catmull-Rom) through the values at HY
  let i = 0;
  while (i < HY.length - 2 && y < HY[i + 1]) i++;
  const k = Math.max(0, Math.min(1, (HY[i] - y) / (HY[i] - HY[i + 1])));
  const p0 = vs[Math.max(0, i - 1)], p1 = vs[i], p2 = vs[i + 1], p3 = vs[Math.min(vs.length - 1, i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (3 * p1 - p0 - 3 * p2 + p3) * k * k * k);
};
const HW = profile([0, 0.23, 0.38, 0.59, 0.74, 0.78, 0.76, 0.72, 0.68, 0.63, 0.48, 0.28, 0.16]); // half-width
const HF = profile([0.3, 0.01, -0.19, -0.46, -0.65, -0.7, -0.69, -0.66, -0.63, -0.6, -0.57, -0.5, -0.4]); // front (face)
const HB = profile([0.3, 0.59, 0.79, 1.06, 1.25, 1.3, 1.2, 0.95, 0.55, 0.42, 0.08, -0.22, -0.36]); // back, then the jaw's back edge and underside
const HPF = profile([2.2, 2.2, 2.2, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 2.9, 3, 3, 3]); // squareness of the front half
const HPB = profile([2.2, 2.2, 2.2, 2.2, 2.25, 2.25, 2.3, 2.4, 2.6, 2.9, 3, 3, 3]); // and of the back half
const TOP = HY[0], CHIN = HY[HY.length - 1];
const slice = (y: number, u: number) => { // the point at angle u round the slice at height y (u in (-π, 0) is the front)
  const a = HW(y), f = HF(y), b = HB(y), c = Math.cos(u), s = Math.sin(u), e = 2 / (s < 0 ? HPF(y) : HPB(y));
  const x = a * Math.sign(c) * Math.abs(c) ** e;
  let z = (f + b) / 2 + ((b - f) / 2) * Math.sign(s) * Math.abs(s) ** e;
  if (s < 0) z -= relief(x, y) * Math.min(1, -s * 3);
  return [x, y, z];
};
const frontZ = (x: number, y: number) => { // the face's depth at (x, y): slice() solved for the front point at that x
  const a = HW(y), f = HF(y), b = HB(y), pf = HPF(y);
  if (Math.abs(x) >= a) return NaN;
  const s = Math.sqrt(1 - (Math.abs(x) / a) ** pf);
  return (f + b) / 2 - ((b - f) / 2) * s ** (2 / pf) - relief(x, y) * Math.min(1, s * 3);
};
const inHead = (x: number, y: number, z: number) => {
  if (y > TOP || y < CHIN) return false;
  const a = HW(y), f = HF(y), b = HB(y), zc = (f + b) / 2, p = z < zc ? HPF(y) : HPB(y);
  return Math.abs(x / a) ** p + Math.abs((z - zc) / ((b - f) / 2)) ** p < 0.92;
};
// The surface as rows of pixels, spaced evenly along the head's outline (so the crown and under the jaw are as full
// as the face), denser on the face than the back of the head. `k` scales every spacing.
const headSurface = (k: number): Pt[] => {
  const pts: Pt[] = [{ x: 0, y: TOP, z: 0.3, spin: true, n: [0, 1, 0] }];
  const rows: number[] = [];
  let acc = 0, prev = [HW(TOP), HF(TOP), HB(TOP)];
  for (let y = TOP; y >= CHIN; y -= 0.002) {
    const cur = [HW(y), HF(y), HB(y)];
    acc += Math.hypot(0.002, Math.max(...cur.map((v, i) => Math.abs(v - prev[i]) * (i === 2 ? 0.45 : 1)))); // the jaw's underside, rarely seen, counts less
    prev = cur;
    if (acc >= 0.058 * k) { rows.push(y); acc = 0; }
  }
  rows.forEach((y, r) => {
    let run = (r % 2) * 0.5, last = slice(y, -Math.PI);
    for (let j = 1; j <= 360; j++) {
      const u = -Math.PI + (j / 360) * Math.PI * 2, p = slice(y, u);
      run += Math.hypot(p[0] - last[0], p[2] - last[2]) / ((Math.sin(u) < 0 ? 0.05 : 0.085) * k);
      last = p;
      if (run < 1) continue;
      run -= 1;
      const e = 0.003, du = slice(y, u + e).map((v, i) => v - slice(y, u - e)[i]), dy = slice(y + e, u).map((v, i) => v - slice(y - e, u)[i]);
      pts.push({ x: p[0], y: p[1], z: p[2], spin: true, a: 1, n: unit([dy[1] * du[2] - dy[2] * du[1], dy[2] * du[0] - dy[0] * du[2], dy[0] * du[1] - dy[1] * du[0]]) });
    }
  });
  return pts;
};
function head(): Shape {
  const on = (x: number, y: number, a: number): Pt | null => {
    const z = frontZ(x, y);
    if (!isFinite(z)) return null;
    const e = 0.004, zx = (frontZ(x + e, y) - frontZ(x - e, y)) / (2 * e), zy = (frontZ(x, y + e) - frontZ(x, y - e)) / (2 * e);
    return { x, y, z, spin: true, a, n: unit([zx, zy, -1]) }; // outward normal of the surface z = frontZ(x, y)
  };
  const extra: Pt[] = [];
  const add = (p: Pt | null) => p && extra.push(p);
  for (const s of [-1, 1]) {
    for (let j = 0; j < 36; j++) { // almond eye
      const u = (j / 36) * Math.PI * 2;
      add(on(s * 0.3 + Math.cos(u) * 0.12, 0.2 + Math.sin(u) * (Math.sin(u) > 0 ? 0.045 : 0.03), 1.5));
    }
    for (let j = 0; j < 8; j++) { const u = (j / 8) * Math.PI * 2; add(on(s * 0.3 + Math.cos(u) * 0.025, 0.2 + Math.sin(u) * 0.025, 1.8)); } // iris
  }
  for (let j = 0; j < 50; j++) { const u = (j / 49) * 2 - 1; add(on(u * 0.23, -0.515 + 0.025 * (1 - u * u), 1.5)); } // mouth line
  for (const s of [-1, 1]) { // ears: the outer rim (helix) with its lobe, and the fold inside it
    const ex = s * (HW(0.12) + 0.015);
    for (let j = 0; j < 48; j++) {
      const u = -Math.PI * 0.6 + (j / 47) * Math.PI * 1.8, lobe = Math.sin(u) < 0 ? 0.75 : 1;
      extra.push({ x: ex, y: 0.12 + Math.sin(u) * 0.26, z: 0.36 + Math.cos(u) * 0.13 * lobe, spin: true, a: 1.3, n: unit([s, 0.1, 0.35]) });
    }
    for (let j = 0; j < 30; j++) {
      const u = -Math.PI * 0.3 + (j / 29) * Math.PI * 1.4;
      extra.push({ x: ex - s * 0.01, y: 0.14 + Math.sin(u) * 0.14, z: 0.34 + Math.cos(u) * 0.07, spin: true, a: 0.9, n: unit([s, 0, 0.3]) });
    }
  }
  for (let j = 0; j < 320; j++) { // neck, from under the skull, flaring into the top of the shoulders
    const u = j * 2.399963, k = j / 320, y = -0.45 - k * 1.18, flare = ease(Math.max(0, (k - 0.65) / 0.35));
    const r = 0.37 + 0.4 * flare, x = Math.cos(u) * r, z = 0.38 - 0.08 * k + Math.sin(u) * r * 0.85;
    if (!inHead(x, y, z)) extra.push({ x, y, z, spin: true, a: 1, n: unit([Math.cos(u), 0.5 * flare, Math.sin(u)]) });
  }
  const want = N - extra.length, first = headSurface(1);
  const surface = headSurface(Math.sqrt(first.length / want)); // spaced so the whole figure lands near N pixels
  return {
    points: fit([...surface, ...extra].map((p) => ({ ...p, y: p.y + 0.23 }))), // centre the figure (crown 1.4 … shoulders -1.4)
    // Turntable: starts facing the viewer, eases through one full clockwise turn, settles facing them again.
    yaw: (t) => -Math.PI * 2 * ease(Math.min(1, t / (ROLE_MS * 0.92))),
    tilt: (t) => 0.14 + 0.22 * Math.sin(t / 1100), // a gentle nod shows the crown
    span: 1.05,
    half: 1.62,
    glow: 1,
    live: (p, _i, t) => {
      const scan = 1.45 - ((t / 2800) % 1) * 2.95;
      return Math.abs(p.y - scan) < 0.022 ? { ...p, red: true } : p;
    },
    under: ({ ctx, W, H, ink, settle }) => { // the dotted wall behind the hologram
      const step = H / 8, r = step * 0.11;
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.07 * settle;
      for (let y = step / 2; y < H; y += step)
        for (let x = (W / 2) % step; x < W; x += step) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    },
  };
}

// Cognitive ABM, after the research poster: terrain from the diamond-square generator the research used, rough at
// every scale and full of peaks. The tallest carries a red beacon, the agents' goal; they wander and climb toward
// it, each leaving its path behind like a line on a graph, and most reach it by the end of the role.
const DS = 129; // a (2^7 + 1)² grid of heights
const DIAMOND_SQUARE = (() => {
  const h = new Float32Array(DS * DS), at = (x: number, y: number) => h[y * DS + x];
  let seed = 1;
  const jitter = () => rnd(seed++ * 0.731 + 0.17) - 0.5;
  const AMP = [0.08, 0.15, 0.9, 1, 0.6, 0.18, 0.06]; // per level, coarse to fine: strongest at the size of a mountain, so peaks spread evenly
  for (const i of [0, DS - 1, DS * (DS - 1), DS * DS - 1]) h[i] = jitter() * AMP[0];
  for (let step = DS - 1, lvl = 0; step > 1; step /= 2, lvl++) {
    const half = step / 2, amp = AMP[lvl];
    for (let y = half; y < DS; y += step) for (let x = half; x < DS; x += step) // diamond: each square's centre
      h[y * DS + x] = (at(x - half, y - half) + at(x + half, y - half) + at(x - half, y + half) + at(x + half, y + half)) / 4 + jitter() * amp;
    for (let y = 0; y < DS; y += half) for (let x = (y / half) % 2 ? 0 : half; x < DS; x += step) { // square: each edge's midpoint
      let sum = 0, cnt = 0;
      for (const [dx, dy] of [[-half, 0], [half, 0], [0, -half], [0, half]])
        if (x + dx >= 0 && x + dx < DS && y + dy >= 0 && y + dy < DS) { sum += at(x + dx, y + dy); cnt++; }
      h[y * DS + x] = sum / cnt + jitter() * amp;
    }
  }
  return h;
})();
const fractal = (x: number, z: number) => { // the grid, sampled smoothly; the map shows a 3:1 band of it
  const u = ((x + 4) / 8) * (DS - 1), v = 43 + ((z + 1.3) / 2.6) * 41.6;
  const i = Math.min(DS - 2, Math.floor(u)), j = Math.min(DS - 2, Math.floor(v)), fu = u - i, fv = v - j, at = (a: number, b: number) => DIAMOND_SQUARE[b * DS + a];
  return at(i, j) * (1 - fu) * (1 - fv) + at(i + 1, j) * fu * (1 - fv) + at(i, j + 1) * (1 - fu) * fv + at(i + 1, j + 1) * fu * fv;
};
const COLS = 80, ROWS = 30; // COLS × ROWS = N, one pixel per grid point
const gx = (i: number) => -4 + (i / (COLS - 1)) * 8, gz = (j: number) => -1.3 + (j / (ROWS - 1)) * 2.6;
const RAW = Array.from({ length: COLS * ROWS }, (_, k) => {
  const x = gx(k % COLS), z = gz(Math.floor(k / COLS));
  return fractal(x, z) + 0.55 * Math.exp(-((x - 1.4) ** 2 + (z + 0.1) ** 2) / 0.18); // one summit stands above the rest
});
const LO = Math.min(...RAW), HI = Math.max(...RAW);
const HGT = RAW.map((v) => -0.8 + 1.6 * ((v - LO) / (HI - LO)) ** 1.6); // sharpened: pointed peaks, open valleys
const gy = (i: number, j: number) => HGT[j * COLS + i];
const MOVES = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]; // eight ways, so paths run like graph lines
const SUMMIT = (() => { const k = HGT.indexOf(Math.max(...HGT)); return [k % COLS, Math.floor(k / COLS)]; })();
const SUN = unit([-0.7, 0.9, 0.6]); // hillshade light, from the map's upper left like a printed relief map
const hillshade = (i: number, j: number) => {
  const dx = (gy(Math.min(COLS - 1, i + 1), j) - gy(Math.max(0, i - 1), j)) / (gx(1) - gx(0)) / 2;
  const dz = (gy(i, Math.min(ROWS - 1, j + 1)) - gy(i, Math.max(0, j - 1))) / (gz(1) - gz(0)) / 2;
  const n = unit([-dx, 1, -dz]);
  return 0.06 + 1.3 * Math.max(0, n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) ** 1.6 + 0.3 * (gy(i, j) + 0.8);
};
const STEP_MS = 90; // agents take a step this often
function terrain(): Shape {
  const pts: Pt[] = [];
  for (let j = 0; j < ROWS; j++)
    for (let i = 0; i < COLS; i++) pts.push({ x: gx(i), y: gy(i, j), z: gz(j), spin: true, a: hillshade(i, j) }); // slopes facing the light are bright
  let agents: { i: number; j: number; trail: number[][] }[] = [], lastT = Infinity, lastStep = 0;
  const clampI = (i: number) => Math.max(0, Math.min(COLS - 1, i)), clampJ = (j: number) => Math.max(0, Math.min(ROWS - 1, j));
  return {
    points: pts,
    yaw: () => 0, // a map doesn't turn; turning a flat map only throws its corners out of the frame
    tilt: 1.2, // a high view from above: reads as a map, with the peaks still rising out of it
    span: 4.3,
    half: 1.45,
    hill: true,
    over: ({ ctx, sx, sy, t, settle, project, ink, red, size }) => {
      // The surface mesh, through the pixels themselves.
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(1, size * 0.3);
      ctx.globalAlpha = 0.08 * settle;
      ctx.beginPath();
      for (let j = 0; j < ROWS; j += 2) for (let i = 0; i < COLS; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, sx[j * COLS + i], sy[j * COLS + i]);
      ctx.stroke();

      // Agents: a fresh population each time the role comes up. The walk catches up to `t` in fixed steps, so a
      // still frame (reduced motion) shows the finished paths.
      if (t < lastT) {
        agents = Array.from({ length: 18 }, (_, a) => {
          let i = 0, j = 0;
          for (let tries = 0; tries < 20; tries++) { // start well away from the goal
            [i, j] = [Math.floor(rnd(a + tries * 7.1 + 0.5) * COLS), Math.floor(rnd(a * 3 + tries * 3.3 + 0.7) * ROWS)];
            if (Math.max(Math.abs(i - SUMMIT[0]), Math.abs(j - SUMMIT[1])) >= 18) break;
          }
          return { i, j, trail: [[i, j]] };
        });
        lastStep = 0;
      }
      lastT = t;
      for (; t - lastStep > STEP_MS; lastStep += STEP_MS) {
        const drive = 0.45 + 0.45 * Math.min(1, lastStep / (ROLE_MS * 0.7)); // later generations head for the goal more
        for (const ag of agents) {
          const gi = SUMMIT[0] - ag.i, gj = SUMMIT[1] - ag.j, r = Math.random();
          let [di, dj] = [0, 0];
          if (Math.max(Math.abs(gi), Math.abs(gj)) <= 1) continue; // arrived: it stays on the summit
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
      }
      const at = (i: number, j: number) => project(gx(i), gy(i, j) + 0.03, gz(j));

      // The goal: a red beacon on the summit, with a ring rippling out from it.
      const [bx, by] = at(SUMMIT[0], SUMMIT[1]), [, topY] = project(gx(SUMMIT[0]), gy(SUMMIT[0], SUMMIT[1]) + 0.9, gz(SUMMIT[1]));
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

      // The paths, fading toward their oldest steps, and each agent's current square.
      ctx.lineWidth = Math.max(1.5, size * 0.7);
      ctx.lineJoin = "round";
      [0.15, 0.3, 0.5, 0.8].forEach((alpha, q) => {
        ctx.globalAlpha = alpha * settle;
        ctx.beginPath();
        for (const { trail } of agents) {
          const from = Math.floor((q * trail.length) / 4), to = Math.min(trail.length - 1, Math.floor(((q + 1) * trail.length) / 4));
          for (let n = from; n <= to; n++) { const [x, y] = at(trail[n][0], trail[n][1]); n > from ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        }
        ctx.stroke();
      });
      ctx.globalAlpha = settle;
      for (const ag of agents) { const [x, y] = at(ag.i, ag.j), d = size * 2.6; ctx.fillRect(x - d / 2, y - d / 2, d, d); }
    },
  };
}

const SHAPES: Record<string, Shape> = { pages: pages(), signal: eeg(), render: head(), fitness: terrain() };

// ---------- The canvas: one set of pixels easing toward the current shape ----------

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const VIEW_LIGHT = unit([-0.6, 0.55, -0.75]); // in view space: from the upper left and to the side, like portrait lighting
const isLight = (hex: string) => { const n = parseInt(hex.replace("#", ""), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 128; };

function PixelArt({ shape }: { shape: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ shape, t: 0, render: (_dt: number) => {}, sync: () => {} });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const bloom = document.createElement("canvas"); // a small, blurred copy of the frame, laid back over it as glow
    const bctx = bloom.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = new Float32Array(N * 3); // start scattered, so the first shape forms out of loose pixels
    for (let i = 0; i < N; i++) [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]] = [(rnd(i) - 0.5) * 10, (rnd(i + 1) - 0.5) * 3, (rnd(i + 2) - 0.5) * 2];
    const sx = new Float32Array(N), sy = new Float32Array(N), alpha = new Float32Array(N), dot = new Float32Array(N);
    let yaw = 0, tilt = 0, scale = 0, glow = 0, ink = "#eeece8", red = "#ef4444", darkGround = true;
    let tick = 0, frame = 0, last = 0, onScreen = false;

    const render = (dt: number) => {
      const s = live.current, sh = SHAPES[s.shape];
      s.t = reduce ? ROLE_MS : s.t + dt;
      if (tick++ % 30 === 0) {
        const cs = getComputedStyle(canvas);
        ink = cs.getPropertyValue("--ink").trim() || ink;
        red = cs.getPropertyValue("--brand").trim() || red;
        darkGround = isLight(ink); // light ink means a dark ground, where glow reads as light
      }
      const k = reduce ? 1 : 1 - Math.pow(0.925, dt / 16.7); // frame-rate independent ease toward the target
      yaw += wrap(sh.yaw(s.t) - yaw) * k;
      tilt += ((typeof sh.tilt === "function" ? sh.tilt(s.t) : sh.tilt) - tilt) * k;
      glow += ((sh.glow ?? 0) - glow) * k;

      const W = canvas.width, H = canvas.height, size = Math.max(1.5, H / 110);
      const fitScale = Math.min((H * 0.4) / (sh.half ?? 1), (W * 0.46) / sh.span);
      scale = scale ? scale + (fitScale - scale) * k : fitScale;
      const cy = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
      const project = (x: number, y: number, z: number, spin = true) => {
        if (spin) [x, z] = [x * cy + z * syw, -x * syw + z * cy];
        else z = 0;
        const y2 = y * ct + z * st, z2 = -y * st + z * ct, persp = 4 / (4 + z2); // positive tilt looks down from above
        return [W / 2 + x * scale * persp, H / 2 - y2 * scale * persp, persp, z2];
      };
      const settle = reduce ? 1 : Math.max(0, Math.min(1, (s.t - 500) / 900));
      const d: Draw = { ctx, W, H, t: s.t, settle, sx, sy, project, ink, red, size };

      ctx.clearRect(0, 0, W, H);
      sh.under?.(d);
      const reds: number[] = [];
      for (let i = 0; i < N; i++) {
        let p = sh.points[i];
        if (sh.live) p = sh.live(p, i, s.t);
        pos[i * 3] += (p.x - pos[i * 3]) * k;
        pos[i * 3 + 1] += (p.y - pos[i * 3 + 1]) * k;
        pos[i * 3 + 2] += (p.z - pos[i * 3 + 2]) * k;
        const [x, y, persp, z2] = project(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], p.spin);
        const a = p.a ?? 1;
        sx[i] = x; sy[i] = y;
        if (p.n) { // lit live from the viewer's upper left; pixels on the far side are dimmed so the figure reads solid
          let [nx, ny, nz] = p.n;
          [nx, nz] = [nx * cy + nz * syw, -nx * syw + nz * cy];
          const ny2 = ny * ct + nz * st, nz2 = -ny * st + nz * ct, facing = -nz2;
          const lit = Math.max(0, nx * VIEW_LIGHT[0] + ny2 * VIEW_LIGHT[1] + nz2 * VIEW_LIGHT[2]);
          // A dark ground shows light pixels, so lit faces are brighter; a light ground shows ink, so shaded faces are darker.
          const tone = darkGround
            ? 0.12 + 0.95 * lit ** 1.3 + (facing > 0 ? 0.55 * (1 - facing) ** 2 : 0)
            : 0.22 + 0.75 * (1 - lit ** 1.3) + (facing > 0 ? 0.4 * (1 - facing) ** 2 : 0);
          alpha[i] = Math.min(1, tone * a) * (facing > -0.05 ? 1 : 0.08);
        } else {
          const tone = sh.hill && !darkGround ? 0.1 + 0.85 * Math.max(0, 1 - a / 1.6) : a; // printed relief: shadows dark
          alpha[i] = Math.min(1, (0.3 + 0.7 * (1 - z2) / 2) * tone);
        }
        dot[i] = size * persp * (a > 1 ? 1.25 : 1);
        if (p.red) reds.push(i);
      }
      ctx.fillStyle = ink;
      for (let i = 0; i < N; i++) {
        ctx.globalAlpha = alpha[i];
        ctx.fillRect(sx[i] - dot[i] / 2, sy[i] - dot[i] / 2, dot[i], dot[i]);
      }
      ctx.fillStyle = red;
      ctx.globalAlpha = 1;
      for (const i of reds) { const r = dot[i] * 1.4; ctx.fillRect(sx[i] - r / 2, sy[i] - r / 2, r, r); }
      sh.over?.(d);

      // Hologram glow: a quarter-size blurred copy of the frame, added back on top (dark theme only).
      if (glow > 0.02 && darkGround && W > 0) {
        bloom.width = Math.max(1, W >> 2); bloom.height = Math.max(1, H >> 2);
        bctx.filter = "blur(2px)";
        bctx.drawImage(canvas, 0, 0, bloom.width, bloom.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.85 * glow;
        ctx.drawImage(bloom, 0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      render(Math.min(50, now - last));
      last = now;
      frame = requestAnimationFrame(loop);
    };
    // Run only while on screen, the tab is visible and motion is allowed.
    const sync = () => {
      const run = onScreen && !document.hidden && !reduce;
      cancelAnimationFrame(frame);
      if (run) { last = performance.now(); frame = requestAnimationFrame(loop); }
      else render(0);
    };
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      render(0);
    };
    live.current.render = render;
    live.current.sync = sync;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => { Object.assign(live.current, { shape, t: 0 }); live.current.render(0); }, [shape]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ---------- The section ----------

// Spec-row pattern (as on Apple and Ferrari spec sheets): every figure for the chosen role is visible at once,
// with a bar sized to its percentage. A loader hands on to the next role.
export default function HighlightsSection() {
  const [g, setG] = useState(0);
  const [seen, setSeen] = useState(false); // replay the count-up when the panel first comes into view
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [t, setT] = useState(1); // count-up progress, 0 → 1
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { threshold: 0.35 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(1);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      setT(1 - Math.pow(1 - k, 4));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    setT(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [g, seen]);

  const group = highlights[g];
  const next = () => setG((i) => (i + 1) % highlights.length);
  const delay = (i: number) => ({ "--d": `${0.08 + i * 0.07}s` }) as React.CSSProperties;

  return (
    <section id="highlights" ref={sectionRef} className="frame pt-8">
      <div className="bg-[var(--surface)] transition-colors duration-500">
        <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h2 className="t-lead font-medium">Numbers from the work</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 t-small">
            <div className="flex flex-wrap gap-x-5 gap-y-1" role="group" aria-label="Choose a role">
              {highlights.map((item, i) => (
                <button
                  key={item.where}
                  aria-pressed={i === g}
                  onClick={() => setG(i)}
                  className={`link min-h-11 transition-colors ${i === g ? "text-[var(--ink)] underline decoration-[var(--brand)]" : "text-[var(--dim)] hover:text-[var(--ink)]"}`}
                >
                  {item.where}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The pixel picture of the chosen role's work, in its own band so it never moves across text. */}
        <div className="relative h-48 md:h-64 overflow-hidden" aria-hidden="true">
          <PixelArt shape={group.art} />
        </div>

        {/* The loader: when it fills, the next role comes up. */}
        {!reduce && (
          <div className="mx-6 md:mx-8 h-[3px] bg-[color-mix(in_srgb,var(--ink)_12%,transparent)]" aria-hidden="true">
            <span
              key={`${g}-${seen}`}
              className="block h-full bg-[var(--brand)] origin-left"
              style={{ animation: `load ${ROLE_MS}ms linear both`, animationPlayState: visible ? "running" : "paused" }}
              onAnimationEnd={next}
            />
          </div>
        )}

        <ul
          key={`${g}-${seen}`}
          className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-x-8 gap-y-8"
          style={{ "--n": group.metrics.length } as React.CSSProperties}
        >
          {group.metrics.map((metric, i) => (
            <li key={metric.label} className="rise" style={delay(i)}>
              <p className="font-semibold tabular-nums leading-none tracking-[-0.03em] text-[clamp(2.5rem,1.9rem+2.4vw,4rem)]" aria-hidden="true">
                {Math.round(metric.value * t)}
                <span className="text-[0.5em] align-top text-[var(--brand)]">{metric.unit}</span>
              </p>
              <span className="mt-4 block h-[3px] bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]" aria-hidden="true">
                <span className="bar-grow block h-full bg-[var(--brand)]" style={{ width: `${metric.value}%`, ...delay(i) }} />
              </span>
              <p className="mt-3 t-small text-[var(--dim)] max-w-[30ch]">
                <span className="sr-only">{metric.value}{metric.unit} </span>
                {metric.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
