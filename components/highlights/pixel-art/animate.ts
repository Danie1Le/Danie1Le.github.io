import { observeIntersections } from "@/lib/observe";
import type { Engine } from "./engine";

const MAX_FRAME_GAP_MS = 50;

export function animateWhileVisible(canvas: HTMLCanvasElement, engine: Engine, reduce: boolean) {
  let frameId = 0, lastTime = 0, onScreen = false;

  const loop = (now: number) => {
    engine.frame(Math.min(MAX_FRAME_GAP_MS, now - lastTime));
    lastTime = now;
    frameId = requestAnimationFrame(loop);
  };

  const shouldAnimate = () => onScreen && !document.hidden && !reduce;

  const startOrStop = () => {
    cancelAnimationFrame(frameId);
    if (!shouldAnimate()) return engine.frame(0);
    lastTime = performance.now();
    frameId = requestAnimationFrame(loop);
  };

  const resizeObserver = new ResizeObserver(() => engine.resize());
  resizeObserver.observe(canvas);
  const stopWatchingScreen = observeIntersections([canvas], (entry) => {
    onScreen = entry.isIntersecting;
    startOrStop();
  });
  document.addEventListener("visibilitychange", startOrStop);

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    stopWatchingScreen();
    document.removeEventListener("visibilitychange", startOrStop);
  };
}
