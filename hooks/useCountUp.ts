import { prefersReducedMotion } from "@/lib/motion";
import { useEffect, useState } from "react";

/** Progress from 0 to 1 over `ms`, easing out, starting when the component mounts. 1 at once under reduced motion. */
export function useCountUp(ms = 900) {
  const [t, setT] = useState(1);
  useEffect(() => {
    if (prefersReducedMotion()) return setT(1);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      setT(1 - Math.pow(1 - k, 4));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    setT(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ms]);
  return t;
}
