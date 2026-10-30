import type { Art } from "@/lib/content";
import { createBloom } from "./bloom";
import { makeCamera } from "./camera";
import { N, ROLE_MS } from "./constants";
import { rnd, wrap } from "./math";
import { depthAlpha, isLightColor, litAlpha } from "./shading";
import { SHAPES } from "./shapes";
import type { Draw } from "./types";

export type Engine = ReturnType<typeof createEngine>;

/**
 * The picture's engine: one set of N pixels on `canvas`, easing toward the current shape each frame.
 * No React and no timers: whoever owns it calls `frame(dt)` (see PixelArt.tsx). With `reduce` set, every frame
 * shows the shape finished and still.
 */
export function createEngine(canvas: HTMLCanvasElement, art: Art, reduce: boolean) {
  const ctx = canvas.getContext("2d")!;
  const addGlow = createBloom();
  const pos = new Float32Array(N * 3); // start scattered, so the first shape forms out of loose pixels
  for (let i = 0; i < N; i++) [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]] = [(rnd(i) - 0.5) * 10, (rnd(i + 1) - 0.5) * 3, (rnd(i + 2) - 0.5) * 2];
  const sx = new Float32Array(N), sy = new Float32Array(N), alpha = new Float32Array(N), dot = new Float32Array(N);
  let yaw = 0, tilt = 0, scale = 0, glow = 0, ink = "#eeece8", red = "#ef4444", darkGround = true;
  let tick = 0, t = 0;

  /** Read the theme's ink and accent from CSS (every 30 frames is plenty to catch a theme switch). */
  const readColors = () => {
    if (tick++ % 30) return;
    const cs = getComputedStyle(canvas);
    ink = cs.getPropertyValue("--ink").trim() || ink;
    red = cs.getPropertyValue("--brand").trim() || red;
    darkGround = isLightColor(ink);
  };

  /** Draw the next frame, `dt` ms after the last. */
  const frame = (dt: number) => {
    const sh = SHAPES[art];
    t = reduce ? ROLE_MS : t + dt;
    readColors();
    const k = reduce ? 1 : 1 - Math.pow(0.925, dt / 16.7); // frame-rate independent ease toward the target
    yaw += wrap(sh.yaw(t) - yaw) * k;
    tilt += ((typeof sh.tilt === "function" ? sh.tilt(t) : sh.tilt) - tilt) * k;
    glow += ((sh.glow ?? 0) - glow) * k;

    const W = canvas.width, H = canvas.height, size = Math.max(1.5, H / 110);
    const fitScale = Math.min((H * 0.4) / (sh.half ?? 1), (W * 0.46) / sh.span);
    scale = scale ? scale + (fitScale - scale) * k : fitScale;
    const { project, view } = makeCamera(W, H, scale, yaw, tilt);
    const settle = reduce ? 1 : Math.max(0, Math.min(1, (t - 500) / 900));
    const d: Draw = { ctx, W, H, t, settle, sx, sy, project, ink, red, size };

    ctx.clearRect(0, 0, W, H);
    sh.under?.(d);
    const reds: number[] = [];
    for (let i = 0; i < N; i++) {
      let p = sh.points[i];
      if (sh.live) p = sh.live(p, i, t);
      pos[i * 3] += (p.x - pos[i * 3]) * k;
      pos[i * 3 + 1] += (p.y - pos[i * 3 + 1]) * k;
      pos[i * 3 + 2] += (p.z - pos[i * 3 + 2]) * k;
      const [x, y, persp, z2] = project(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], p.spin);
      const a = p.a ?? 1;
      sx[i] = x; sy[i] = y;
      alpha[i] = p.n ? litAlpha(view(p.n), a, darkGround) : depthAlpha(z2, a, !!sh.hill && !darkGround);
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
    if (glow > 0.02 && darkGround && W > 0) addGlow(ctx, W, H, glow); // dark theme only
    ctx.globalAlpha = 1;
  };

  return {
    frame,
    /** Switch to another role's picture: its clock restarts and the pixels start moving there. */
    show(next: Art) { art = next; t = 0; frame(0); },
    /** Match the canvas to its CSS size (sharp on high-density screens, up to 2×). */
    resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      frame(0);
    },
  };
}
