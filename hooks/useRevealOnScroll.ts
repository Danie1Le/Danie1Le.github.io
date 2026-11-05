import { markRevealsHydrated } from "@/lib/boot";
import { observeIntersections } from "@/lib/observe";
import { useEffect } from "react";

const JUST_ABOVE_THE_BOTTOM_EDGE = "0px 0px -8% 0px";

export function useRevealOnScroll() {
  useEffect(() => {
    markRevealsHydrated();
    const revealables = Array.from(document.querySelectorAll("[data-reveal]"));
    return observeIntersections(revealables, (entry, observer) => {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute("data-in", "");
      observer.unobserve(entry.target);
    }, { rootMargin: JUST_ABOVE_THE_BOTTOM_EDGE });
  }, []);
}
