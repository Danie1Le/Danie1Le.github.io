"use client"

import { site } from "@/lib/site";
import { useRef } from "react";
import { useParallax } from "./useParallax";

const DRIFT_RATE = 0.12;
const DRIFT_UNTIL_SCROLLED = 900;

export default function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, DRIFT_RATE, DRIFT_UNTIL_SCROLLED);

  return (
    <div ref={ref} className="w-[min(64vw,300px)] md:w-[min(30vw,380px)] arch ring-up bg-[var(--brand)] p-[var(--portrait-border)]">
      <div className="arch arch-inner aspect-[4/5] overflow-hidden">
        <img
          src="/Profile_Picture.png"
          alt={`Portrait of ${site.name}`}
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
