"use client"

import type { Art } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { createEngine, type Engine } from "./engine";

/**
 * A role's work drawn in pixels that re-form from one role's picture into the next. Fills its positioned parent.
 * Animates only while on screen, the tab is visible and motion is allowed; otherwise it shows a still frame.
 */
export default function PixelArt({ art }: { art: Art }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const e = (engine.current = createEngine(canvas, art, reduce));
    let raf = 0, last = 0, onScreen = false;

    const loop = (now: number) => {
      e.frame(Math.min(50, now - last));
      last = now;
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (onScreen && !document.hidden && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
      else e.frame(0);
    };

    const ro = new ResizeObserver(() => e.resize());
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- the engine is made once; later roles go through show()

  useEffect(() => { engine.current?.show(art); }, [art]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
