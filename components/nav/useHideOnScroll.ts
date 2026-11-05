import { isDesktop } from "@/lib/media";
import { onScrollFrame } from "@/lib/scroll";
import { NAV_HEIGHT } from "@/lib/sections";
import { useEffect, useRef, useState } from "react";

const ALWAYS_SHOWN_ABOVE_Y = 100;
const SCROLL_JITTER = 4;
const REVEAL_ZONE = NAV_HEIGHT + 16;

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const followScroll = () => {
      const y = window.scrollY;
      if (!isDesktop() || y < ALWAYS_SHOWN_ABOVE_Y) setHidden(false);
      else if (y > lastY.current + SCROLL_JITTER) setHidden(true);
      else if (y < lastY.current - SCROLL_JITTER) setHidden(false);
      lastY.current = y;
    };
    const revealNearTopEdge = (e: MouseEvent) => {
      if (isDesktop() && e.clientY < REVEAL_ZONE) setHidden(false);
    };

    lastY.current = window.scrollY;
    const stopFollowingScroll = onScrollFrame(followScroll);
    window.addEventListener("mousemove", revealNearTopEdge);
    return () => {
      stopFollowingScroll();
      window.removeEventListener("mousemove", revealNearTopEdge);
    };
  }, []);

  return hidden;
}
