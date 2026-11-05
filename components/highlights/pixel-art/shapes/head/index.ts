import { PIXEL_COUNT, ROLE_MS } from "../../constants";
import { smoothstep } from "../../math";
import { toPixelCount } from "../../surfaces";
import type { Draw, Shape } from "../../types";
import { ears, faceLines, neck } from "./features";
import { headSurface } from "./profile";

// ResVR: a human head as a hologram, built like a contour model from horizontal slices (see profile.ts), with the
// face's features, ears and neck added. Every pixel carries its surface direction, so it is lit live as the head turns.

/** The dotted wall behind the hologram. */
const dottedWall = ({ ctx, width: W, height: H, ink, formed: settle }: Draw) => {
  const step = H / 8, r = step * 0.11;
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.07 * settle;
  for (let y = step / 2; y < H; y += step)
    for (let x = (W / 2) % step; x < W; x += step) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
};

export function head(): Shape {
  const extra = [...faceLines(), ...ears(), ...neck()];
  const want = PIXEL_COUNT - extra.length, first = headSurface(1);
  const surface = headSurface(Math.sqrt(first.length / want)); // spaced so the whole figure lands near PIXEL_COUNT pixels
  return {
    points: toPixelCount([...surface, ...extra].map((p) => ({ ...p, y: p.y + 0.23 }))), // centre the figure (crown 1.4 … shoulders -1.4)
    // Turntable: starts facing the viewer, eases through one full clockwise turn, settles facing them again.
    yaw: (t) => -Math.PI * 2 * smoothstep(Math.min(1, t / (ROLE_MS * 0.92))),
    tilt: (t) => 0.14 + 0.22 * Math.sin(t / 1100), // a gentle nod shows the crown
    halfWidth: 1.05,
    halfHeight: 1.62,
    glow: 1,
    move: (p, t) => { // a red scan line sweeps down the figure
      const scan = 1.45 - ((t / 2800) % 1) * 2.95;
      return Math.abs(p.y - scan) < 0.022 ? { ...p, red: true } : p;
    },
    drawBehind: dottedWall,
  };
}
