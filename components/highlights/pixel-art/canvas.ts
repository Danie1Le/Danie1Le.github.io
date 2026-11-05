import { TAU } from "./math";

type Point2 = { x: number; y: number };

export const fillSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, side: number) =>
  ctx.fillRect(x - side / 2, y - side / 2, side, side);

export const fillDot = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
};

export const tracePath = (ctx: CanvasRenderingContext2D, points: Point2[]) =>
  points.forEach(({ x, y }, i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
