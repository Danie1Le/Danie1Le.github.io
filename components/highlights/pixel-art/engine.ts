import type { Art } from "@/lib/content";
import { createBloom } from "./bloom";
import { fillSquare } from "./canvas";
import { PIXEL_COUNT, ROLE_MS } from "./constants";
import { type Lens, makeLens } from "./lens";
import { clamp01, easeToward, seededRandom, wrapAngle } from "./math";
import { depthAlpha, isLightColor, litAlpha } from "./shading";
import { SHAPES } from "./shapes";
import type { Draw, Shape } from "./types";

export type Engine = ReturnType<typeof createEngine>;

const EASE_KEPT_PER_FRAME = 0.925;
const FRAME_MS = 16.7;
const THEME_CHECK_EVERY = 30;
const FORMING_STARTS_MS = 500;
const FORMING_MS = 900;
const MAX_PIXEL_RATIO = 2;
const CONTOUR_GROWTH = 1.25;
const RED_GROWTH = 1.4;
const MIN_GLOW = 0.02;
const FIT_HEIGHT_SHARE = 0.4;
const FIT_WIDTH_SHARE = 0.46;
const MIN_PIXEL_SIZE = 1.5;
const PIXELS_PER_HEIGHT = 110;

function scatteredStart() {
  const x = new Float32Array(PIXEL_COUNT), y = new Float32Array(PIXEL_COUNT), z = new Float32Array(PIXEL_COUNT);
  for (let i = 0; i < PIXEL_COUNT; i++) {
    x[i] = (seededRandom(i) - 0.5) * 10;
    y[i] = (seededRandom(i + 1) - 0.5) * 3;
    z[i] = (seededRandom(i + 2) - 0.5) * 2;
  }
  return { x, y, z };
}

export function createEngine(canvas: HTMLCanvasElement, art: Art, reduce: boolean) {
  const ctx = canvas.getContext("2d")!;
  const addGlow = createBloom();
  const position = scatteredStart();
  const screenX = new Float32Array(PIXEL_COUNT), screenY = new Float32Array(PIXEL_COUNT);
  const alpha = new Float32Array(PIXEL_COUNT), dotSize = new Float32Array(PIXEL_COUNT);
  const camera = { yaw: 0, tilt: 0, scale: 0, glow: 0 };
  const colors = { ink: "#eeece8", red: "#ef4444", darkGround: true };
  let frameCount = 0, t = 0;

  const readThemeColors = () => {
    const style = getComputedStyle(canvas);
    colors.ink = style.getPropertyValue("--ink").trim() || colors.ink;
    colors.red = style.getPropertyValue("--brand").trim() || colors.red;
    colors.darkGround = isLightColor(colors.ink);
  };

  const easeRate = (dt: number) => (reduce ? 1 : 1 - Math.pow(EASE_KEPT_PER_FRAME, dt / FRAME_MS));

  const formed = () => (reduce ? 1 : clamp01((t - FORMING_STARTS_MS) / FORMING_MS));

  const easeCamera = (shape: Shape, rate: number, width: number, height: number) => {
    camera.yaw += wrapAngle(shape.yaw(t) - camera.yaw) * rate;
    camera.tilt = easeToward(camera.tilt, shape.tilt(t), rate);
    camera.glow = easeToward(camera.glow, shape.glow ?? 0, rate);
    const fitScale = Math.min((height * FIT_HEIGHT_SHARE) / (shape.halfHeight ?? 1), (width * FIT_WIDTH_SHARE) / shape.halfWidth);
    camera.scale = camera.scale ? easeToward(camera.scale, fitScale, rate) : fitScale;
  };

  const placePixels = (shape: Shape, rate: number, { project, view }: Lens, pixelSize: number) => {
    const redPixels: number[] = [];
    const printedShadow = !!shape.hillshaded && !colors.darkGround;
    for (let i = 0; i < PIXEL_COUNT; i++) {
      const p = shape.move ? shape.move(shape.points[i], t) : shape.points[i];
      position.x[i] = easeToward(position.x[i], p.x, rate);
      position.y[i] = easeToward(position.y[i], p.y, rate);
      position.z[i] = easeToward(position.z[i], p.z, rate);
      const onScreen = project(position.x[i], position.y[i], position.z[i]);
      const brightness = p.brightness ?? 1;
      screenX[i] = onScreen.x;
      screenY[i] = onScreen.y;
      alpha[i] = p.normal ? litAlpha(view(p.normal), brightness, colors.darkGround) : depthAlpha(onScreen.depth, brightness, printedShadow);
      dotSize[i] = pixelSize * onScreen.perspective * (brightness > 1 ? CONTOUR_GROWTH : 1);
      if (p.red) redPixels.push(i);
    }
    return redPixels;
  };

  const paintPixels = (redPixels: number[]) => {
    ctx.fillStyle = colors.ink;
    for (let i = 0; i < PIXEL_COUNT; i++) {
      ctx.globalAlpha = alpha[i];
      fillSquare(ctx, screenX[i], screenY[i], dotSize[i]);
    }
    ctx.fillStyle = colors.red;
    ctx.globalAlpha = 1;
    for (const i of redPixels) fillSquare(ctx, screenX[i], screenY[i], dotSize[i] * RED_GROWTH);
  };

  const frame = (dt: number) => {
    const shape = SHAPES[art];
    t = reduce ? ROLE_MS : t + dt;
    if (frameCount++ % THEME_CHECK_EVERY === 0) readThemeColors();
    const rate = easeRate(dt);
    const width = canvas.width, height = canvas.height, pixelSize = Math.max(MIN_PIXEL_SIZE, height / PIXELS_PER_HEIGHT);
    easeCamera(shape, rate, width, height);
    const lens = makeLens(width, height, camera);
    const d: Draw = { ctx, width, height, t, formed: formed(), screenX, screenY, project: lens.project, ink: colors.ink, red: colors.red, pixelSize };

    ctx.clearRect(0, 0, width, height);
    shape.drawBehind?.(d);
    paintPixels(placePixels(shape, rate, lens, pixelSize));
    shape.drawInFront?.(d);
    if (camera.glow > MIN_GLOW && colors.darkGround && width > 0) addGlow(ctx, width, height, camera.glow);
    ctx.globalAlpha = 1;
  };

  return {
    frame,
    show(next: Art) {
      art = next;
      t = 0;
      frame(0);
    },
    resize() {
      const pixelRatio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * pixelRatio;
      canvas.height = canvas.clientHeight * pixelRatio;
      frame(0);
    },
  };
}
