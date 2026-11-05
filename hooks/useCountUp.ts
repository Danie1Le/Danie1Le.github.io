import { prefersReducedMotion } from "@/lib/media";
import { useEffect, useState } from "react";

const easeOutQuart = (progress: number) => 1 - Math.pow(1 - progress, 4);

export function useCountUp(durationMs = 900) {
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const linear = Math.min(1, (now - start) / durationMs);
      setProgress(easeOutQuart(linear));
      if (linear < 1) frame = requestAnimationFrame(tick);
    };
    setProgress(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);
  return progress;
}
