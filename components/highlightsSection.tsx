"use client"

import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { highlights } from "@/lib/content";
import { useRef, useState } from "react";
import MetricList from "./highlights/MetricList";
import PixelArt from "./highlights/pixel-art/PixelArt";
import RoleLoader from "./highlights/RoleLoader";
import RoleTabs from "./highlights/RoleTabs";

// "Numbers from the work": pick a role (or let the loader move on every few seconds) to see its figures over a
// pixel picture of that work. The parts live in ./highlights; the pictures in ./highlights/pixel-art.
export default function HighlightsSection() {
  const [g, setG] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { visible, seen } = useInView(sectionRef, 0.35);
  const reduce = useReducedMotion();
  const group = highlights[g];
  const run = `${g}-${seen}`; // a new role, or the panel's first appearance, restarts the loader and the count-up

  return (
    <section id="highlights" ref={sectionRef} className="frame pt-8">
      <div className="bg-[var(--surface)] transition-colors duration-500">
        <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h2 className="t-lead font-medium">Numbers from the work</h2>
          <RoleTabs roles={highlights.map((h) => h.where)} active={g} onPick={setG} />
        </div>

        {/* The picture, in its own band so it never moves across text. */}
        <div className="relative h-48 md:h-64 overflow-hidden" aria-hidden="true">
          <PixelArt art={group.art} />
        </div>

        {!reduce && <RoleLoader key={`loader-${run}`} running={visible} onDone={() => setG((i) => (i + 1) % highlights.length)} />}

        <MetricList key={`figures-${run}`} metrics={group.metrics} />
      </div>
    </section>
  );
}
