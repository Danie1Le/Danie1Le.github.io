const GLOW_OPACITY = 0.85;

export function createBloom() {
  const blurred = document.createElement("canvas");
  const blurredCtx = blurred.getContext("2d")!;
  return (ctx: CanvasRenderingContext2D, width: number, height: number, strength: number) => {
    blurred.width = Math.max(1, width >> 2);
    blurred.height = Math.max(1, height >> 2);
    blurredCtx.filter = "blur(2px)";
    blurredCtx.drawImage(ctx.canvas, 0, 0, blurred.width, blurred.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = GLOW_OPACITY * strength;
    ctx.drawImage(blurred, 0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  };
}
