/** Hologram glow: a quarter-size blurred copy of the frame, added back on top of it at `strength` (0-1). */
export function createBloom() {
  const bloom = document.createElement("canvas");
  const bctx = bloom.getContext("2d")!;
  return (ctx: CanvasRenderingContext2D, W: number, H: number, strength: number) => {
    bloom.width = Math.max(1, W >> 2); bloom.height = Math.max(1, H >> 2);
    bctx.filter = "blur(2px)";
    bctx.drawImage(ctx.canvas, 0, 0, bloom.width, bloom.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.85 * strength;
    ctx.drawImage(bloom, 0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
  };
}
