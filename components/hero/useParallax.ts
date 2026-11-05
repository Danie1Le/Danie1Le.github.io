import { prefersReducedMotion } from "@/lib/media";
import { onScrollFrame } from "@/lib/scroll";
import { type RefObject, useEffect } from "react";

export function useParallax(ref: RefObject<HTMLElement>, rate: number, maxScroll: number) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    return onScrollFrame(() => {
      if (ref.current) ref.current.style.transform = `translateY(${Math.min(window.scrollY, maxScroll) * rate}px)`;
    });
  }, [ref, rate, maxScroll]);
}
