import type { Vec3 } from "./math";

export type Part = "brain" | "wave" | "arrow" | "car" | "wheel" | "tip";

export type Pt = {
  x: number;
  y: number;
  z: number;
  red?: boolean;
  flagged?: boolean;
  brightness?: number;
  normal?: Vec3;
  part?: Part;
  partIndex?: number;
};

export type Screen = { x: number; y: number; perspective: number; depth: number };

export type Projector = (x: number, y: number, z: number) => Screen;

export type Draw = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  t: number;
  formed: number;
  screenX: Float32Array;
  screenY: Float32Array;
  project: Projector;
  ink: string;
  red: string;
  pixelSize: number;
};

type OverTime = (msSinceRoleStart: number) => number;

export type Shape = {
  points: Pt[];
  yaw: OverTime;
  tilt: OverTime;
  halfWidth: number;
  halfHeight?: number;
  glow?: number;
  hillshaded?: boolean;
  move?: (p: Pt, msSinceRoleStart: number) => Pt;
  drawBehind?: (d: Draw) => void;
  drawInFront?: (d: Draw) => void;
};

export type Ellipsoid = { center: Vec3; radii: Vec3 };
