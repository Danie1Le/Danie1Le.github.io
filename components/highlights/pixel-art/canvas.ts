export const fillSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, side: number) =>
  ctx.fillRect(x - side / 2, y - side / 2, side, side);
