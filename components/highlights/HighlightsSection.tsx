"use client"

import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { highlights } from "@/lib/content";
import { SURFACE } from "@/lib/styles";
import { useRef, useState } from "react";
import MetricList from "./MetricList";
import PixelArt from "./pixel-art/PixelArt";
import RoleLoader from "./RoleLoader";
import RoleTabs from "./RoleTabs";

const MOSTLY_ON_SCREEN = 0.35;
const ROLE_NAMES = highlights.map((highlight) => highlight.where);

export default function HighlightsSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { visible, seen } = useInView(sectionRef, MOSTLY_ON_SCREEN);
  const reduceMotion = useReducedMotion();
  const role = highlights[roleIndex];
  const replayKey = `${roleIndex}-${seen}`;
  const showNextRole = () => setRoleIndex((i) => (i + 1) % highlights.length);

  return (
    <section id="highlights" ref={sectionRef} className="frame pt-8">
      <div className={SURFACE}>
        <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <h2 className="t-lead font-medium">Numbers from the work</h2>
          <RoleTabs roles={ROLE_NAMES} active={roleIndex} onPick={setRoleIndex} />
        </div>

        <div className="relative h-48 md:h-64 overflow-hidden" aria-hidden="true">
          <PixelArt art={role.art} />
        </div>

        {!reduceMotion && <RoleLoader key={`loader-${replayKey}`} running={visible} onDone={showNextRole} />}

        <MetricList key={`figures-${replayKey}`} metrics={role.metrics} />
      </div>
    </section>
  );
}
