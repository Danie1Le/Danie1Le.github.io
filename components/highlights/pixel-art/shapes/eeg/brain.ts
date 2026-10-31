import { segDist, unit, vnoise } from "../../math";
import { inEllipsoid, shell, turn } from "../../surfaces";
import type { Pt } from "../../types";

// The brain, seen from the side (frontal lobe to the right), drawn as a line drawing with eight red electrodes on top.

const BRAIN = [-3.05, 0.12, 0.35]; // where it sits in the scene

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

/** The brain's pixels, in its own frame. */
export function brainPoints(): Pt[] {
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
  return brain.map((p) => ({ ...p, g: "brain" }));
}

/** A brain pixel this frame: swaying gently on its own spot. */
export function moveBrain(p: Pt, t: number): Pt {
  const q = turn(p, -0.2 + 0.45 * Math.sin(t / 2000), 0, 0);
  return { ...q, x: q.x + BRAIN[0], y: q.y + BRAIN[1], z: q.z + BRAIN[2] };
}
