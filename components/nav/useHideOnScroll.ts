import { useEffect, useRef, useState } from "react";

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

/**
 * On desktop the bar slides away as you scroll down and comes back as you scroll up, near the top of the page,
 * or when the cursor nears the top edge. On phones it always stays.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      if (!isDesktop() || y < 100) setHidden(false);
      else if (y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDesktop() && e.clientY < 80) setHidden(false);
    };

    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return hidden;
}
