import type { CSSProperties } from "react";

const TINTS = {
  faint: "bg-[color-mix(in_srgb,var(--ink)_12%,transparent)]",
  soft: "bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]",
};

interface ProgressTrackProps {
  as: "div" | "span";
  tint: keyof typeof TINTS;
  className: string;
  fillClassName: string;
  fillStyle: CSSProperties;
  onFillEnd?: () => void;
}

export default function ProgressTrack({ as: Track, tint, className, fillClassName, fillStyle, onFillEnd }: ProgressTrackProps) {
  return (
    <Track className={`block h-[3px] ${TINTS[tint]} ${className}`} aria-hidden="true">
      <span className={`block h-full bg-[var(--brand)] ${fillClassName}`} style={fillStyle} onAnimationEnd={onFillEnd} />
    </Track>
  );
}
