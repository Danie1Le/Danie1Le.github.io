import type { CSSProperties } from "react";

interface ProgressTrackProps {
  as: "div" | "span";
  className: string;
  fillClassName: string;
  fillStyle: CSSProperties;
  onFillEnd?: () => void;
}

export default function ProgressTrack({ as: Track, className, fillClassName, fillStyle, onFillEnd }: ProgressTrackProps) {
  return (
    <Track className={`h-[3px] ${className}`} aria-hidden="true">
      <span className={`block h-full bg-[var(--brand)] ${fillClassName}`} style={fillStyle} onAnimationEnd={onFillEnd} />
    </Track>
  );
}
