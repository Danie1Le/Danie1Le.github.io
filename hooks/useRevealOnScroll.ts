import { useEffect } from "react";

/**
 * Each [data-reveal] element rises in once, as it enters the screen (see globals.css). Marks the page as revealed,
 * so the boot script in app/layout.tsx knows not to disarm the effect.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    (window as Window & { __revealed?: boolean }).__revealed = true;
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-in", ""); // an attribute React never rewrites, unlike className
          reveal.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
    return () => reveal.disconnect();
  }, []);
}
