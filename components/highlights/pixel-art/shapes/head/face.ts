import { gs } from "../../math";

// The ResVR face's relief: brow, eye sockets, nose, cheekbones, lips and chin, pressed into the front of head().
export const faceDepth = (x: number, y: number) => {
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
export const faceHalfWidth = (y: number) => 0.78 * (1 - (y < 0 ? 0.3 : 0.12) * (y / 1.1) ** 2); // narrower at the chin
// The relief on its own: faceDepth without its overall curve, faded out toward the face's edge, deepened to read front-on.
export const relief = (x: number, y: number) => {
  const e = (x / faceHalfWidth(y)) ** 2 + (y / 1.1) ** 2;
  return e < 1 ? 1.35 * (faceDepth(x, y) - 0.5 * Math.sqrt(Math.max(0, 1 - (x / 0.85) ** 2))) * (1 - e ** 3) : 0;
};

