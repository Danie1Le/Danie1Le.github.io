import { GOLDEN_ANGLE, distanceToSegment, normalize, times, valueNoise, type Vec3 } from "../../math";
import { inEllipsoid, placeAt, shell, turn } from "../../surfaces";
import type { Ellipsoid, Pt } from "../../types";
import { redSquare } from "../redSquare";

const BRAIN_POSITION = [-3.05, 0.12, 0.35];
const CEREBRUM: Ellipsoid = { center: [0, 0.1, 0], radii: [0.95, 0.62, 0.6] };
const TEMPORAL_LOBE: Ellipsoid = { center: [0.22, -0.2, 0], radii: [0.56, 0.22, 0.54] };
const CEREBELLUM: Ellipsoid = { center: [-0.6, -0.33, 0], radii: [0.36, 0.2, 0.46] };
const FLAT_UNDERSIDE = 0.72;
const TEMPORAL_SHARE = 0.3;
const DRAWN_LINE_COUNT = 640;
const ELECTRODES = 8;

const foldHeight = (x: number, y: number, z: number) =>
  Math.sin(8.5 * (valueNoise(x * 4.4 + z * 2.8 + 5, y * 4.6 - z * 2.2) + 0.6 * valueNoise(z * 5.8 - y * 3, x * 5.5 + 1)));

const onFoldEdge = (x: number, y: number, z: number) => Math.abs(foldHeight(x, y, z)) < 0.14;
const onLateralFissure = (x: number, y: number, z: number) => distanceToSegment(x, y, 0.66, -0.1, -0.3, 0.1) < 0.018 && Math.abs(z) > 0.2;
const onCentralSulcus = (x: number, y: number, z: number) => distanceToSegment(x, y, 0.0, 0.76, 0.36, -0.02) < 0.016 && Math.abs(z) > 0.05;
const onDrawnLine = (x: number, y: number, z: number) => onFoldEdge(x, y, z) || onLateralFissure(x, y, z) || onCentralSulcus(x, y, z);

const bumpedByFolds = (p: Pt, c: Vec3): Pt => {
  const k = 1 + 0.05 * foldHeight(p.x, p.y, p.z);
  return { ...p, x: c[0] + (p.x - c[0]) * k, y: c[1] + (p.y - c[1]) * k, z: c[2] + (p.z - c[2]) * k };
};

const centerY = CEREBRUM.center[1];
const squashUnderside = (y: number, k: number) => (y < centerY ? centerY + (y - centerY) * k : y);
const inCerebrum = (p: Pt) => inEllipsoid({ ...p, y: squashUnderside(p.y, 1 / FLAT_UNDERSIDE) }, CEREBRUM);

const flattenUnderside = (p: Pt): Pt => ({
  ...p,
  y: squashUnderside(p.y, FLAT_UNDERSIDE),
  normal: normalize([p.normal![0], p.normal![1] / (p.y < centerY ? FLAT_UNDERSIDE : 1), p.normal![2]]),
});

const cerebrumSurface = (count: number) =>
  shell(count, CEREBRUM, () => true)
    .map(flattenUnderside)
    .filter((p) => !inEllipsoid(p, TEMPORAL_LOBE))
    .map((p) => bumpedByFolds(p, CEREBRUM.center));

const temporalLobeSurface = (count: number) =>
  shell(Math.round(count * TEMPORAL_SHARE), TEMPORAL_LOBE, (p) => !inCerebrum(p)).map((p) => bumpedByFolds(p, TEMPORAL_LOBE.center));

const cortex = (count: number) => [...cerebrumSurface(count), ...temporalLobeSurface(count)];

const everyNth = <T>(items: T[], keep: number) => items.filter((_, i) => i % Math.max(1, Math.round(items.length / keep)) === 0);

const unlit = ({ normal: _normal, ...p }: Pt): Pt => p;

function cortexDrawing(): Pt[] {
  const faintVolume = cortex(300).map((p) => ({ ...p, brightness: 0.3 }));
  const facingLines = cortex(16000).filter((p) => p.z < 0.12 && onDrawnLine(p.x, p.y, p.z));
  const lines = everyNth(facingLines, DRAWN_LINE_COUNT).map((p) => ({ ...unlit(p), brightness: 1.5 }));
  return [...faintVolume, ...lines];
}

const cerebellum = (): Pt[] =>
  shell(160, CEREBELLUM, (p) => !inCerebrum(p)).map((p) => ({ ...p, brightness: 0.3 + 0.9 * Math.abs(Math.sin((p.y - 0.35 * p.x) * 40)) }));

function brainstem(): Pt[] {
  const pts: Pt[] = [];
  for (let j = 0; j < 70; j++) {
    const angle = j * GOLDEN_ANGLE, down = j / 70;
    const p = { x: -0.2 + 0.08 * down + Math.cos(angle) * 0.11, y: -0.24 - down * 0.58, z: Math.sin(angle) * 0.11 };
    if (!inCerebrum({ ...p }) && !inEllipsoid(p, CEREBELLUM)) pts.push({ ...p, brightness: 0.7, normal: [Math.cos(angle), 0, Math.sin(angle)] });
  }
  return pts;
}

function electrode(index: number): Pt[] {
  const [cx, cy] = CEREBRUM.center, [rx, ry, rz] = CEREBRUM.radii;
  const x = -0.62 + index * 0.177, z = (index % 2 ? 1 : -1) * 0.24;
  const y = cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2 - (z / rz) ** 2)) + 0.05;
  return redSquare(x, y, z);
}

export function brainPoints(): Pt[] {
  const brain = [...cortexDrawing(), ...cerebellum(), ...brainstem(), ...times(ELECTRODES, electrode).flat()];
  return brain.map((p) => ({ ...p, part: "brain" }));
}

export function moveBrain(p: Pt, t: number): Pt {
  const swayed = turn(p, -0.2 + 0.45 * Math.sin(t / 2000), 0, 0);
  return placeAt(swayed, BRAIN_POSITION);
}
