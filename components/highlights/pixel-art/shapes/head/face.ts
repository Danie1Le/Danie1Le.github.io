import { gaussian as bump } from "../../math";

const FACE_HALF_HEIGHT = 1.1;
const FRONT_ON_DEEPENING = 1.35;

const faceCurve = (x: number) => 0.5 * Math.sqrt(Math.max(0, 1 - (x / 0.85) ** 2));
const browRidge = (ax: number, y: number) => 0.07 * bump(y - 0.36, 0.06) * bump(ax - 0.28, 0.2);
const eyeSockets = (ax: number, y: number) => 0.13 * bump(ax - 0.3, 0.12) * bump(y - 0.2, 0.08);
const eyes = (ax: number, y: number) => 0.07 * bump(ax - 0.3, 0.07) * bump(y - 0.2, 0.045);
const noseBridge = (x: number, y: number) => 0.26 * bump(x, 0.07 + 0.05 * Math.max(0, -y)) * bump(y + 0.06, 0.17);
const noseTip = (x: number, y: number) => 0.1 * bump(x, 0.09) * bump(y + 0.25, 0.06);
const nostrils = (ax: number, y: number) => 0.05 * bump(ax - 0.11, 0.05) * bump(y + 0.28, 0.04);
const cheekbones = (ax: number, y: number) => 0.05 * bump(ax - 0.45, 0.14) * bump(y + 0.02, 0.12);
const upperLip = (x: number, y: number) => 0.07 * bump(x, 0.2) * bump(y + 0.47, 0.035);
const lowerLip = (x: number, y: number) => 0.08 * bump(x, 0.18) * bump(y + 0.57, 0.04);
const mouthLine = (x: number, y: number) => 0.05 * bump(x, 0.22) * bump(y + 0.515, 0.012);
const chin = (x: number, y: number) => 0.08 * bump(x, 0.18) * bump(y + 0.85, 0.1);

const faceDepth = (x: number, y: number) => {
  const ax = Math.abs(x);
  return faceCurve(x)
    + browRidge(ax, y)
    - eyeSockets(ax, y)
    + eyes(ax, y)
    + noseBridge(x, y)
    + noseTip(x, y)
    + nostrils(ax, y)
    + cheekbones(ax, y)
    + upperLip(x, y)
    + lowerLip(x, y)
    - mouthLine(x, y)
    + chin(x, y);
};

const faceHalfWidth = (y: number) => 0.78 * (1 - (y < 0 ? 0.3 : 0.12) * (y / FACE_HALF_HEIGHT) ** 2);

export const relief = (x: number, y: number) => {
  const towardEdge = (x / faceHalfWidth(y)) ** 2 + (y / FACE_HALF_HEIGHT) ** 2;
  if (towardEdge >= 1) return 0;
  return FRONT_ON_DEEPENING * (faceDepth(x, y) - faceCurve(x)) * (1 - towardEdge ** 3);
};
