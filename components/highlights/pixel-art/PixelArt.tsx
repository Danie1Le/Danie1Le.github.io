"use client"

import type { Art } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/media";
import { useEffect, useRef } from "react";
import { animateWhileVisible } from "./animate";
import { createEngine, type Engine } from "./engine";

export default function PixelArt({ art }: { art: Art }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const firstArt = useRef(art);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const engine = createEngine(canvas, firstArt.current, reduce);
    engineRef.current = engine;
    return animateWhileVisible(canvas, engine, reduce);
  }, []);

  useEffect(() => { engineRef.current?.show(art); }, [art]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
