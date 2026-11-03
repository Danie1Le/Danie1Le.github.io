"use client"

import { prefersReducedMotion } from "@/lib/motion";
import { useEffect, useRef } from "react";

/** The portrait in its arched alcove with the red border, drifting a little slower than the page as you scroll away. */
export default function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${Math.min(window.scrollY, 900) * 0.12}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div ref={ref} className="w-[min(64vw,300px)] md:w-[min(30vw,380px)] arch ring-up bg-[var(--brand)] p-[3px]">
      <div className="arch arch-inner aspect-[4/5] overflow-hidden">
        <img
          src="/Profile_Picture.png"
          alt="Portrait of Daniel Le"
          width={1024}
          height={1024}
          fetchPriority="high"
          className="lights-up w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
      </div>
    </div>
  );
}
