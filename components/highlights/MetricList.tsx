import { useCountUp } from "@/hooks/useCountUp";
import type { Metric } from "@/lib/content";
import { staggeredDelay } from "@/lib/motion";
import type { CSSProperties } from "react";
import ProgressTrack from "./ProgressTrack";

const FIRST_BAR_DELAY_S = 0.08;
const BAR_STAGGER_S = 0.07;
const barDelay = (index: number) => staggeredDelay(FIRST_BAR_DELAY_S, BAR_STAGGER_S, index);

export default function MetricList({ metrics }: { metrics: Metric[] }) {
  const progress = useCountUp();
  return (
    <ul
      className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-x-8 gap-y-8"
      style={{ "--n": metrics.length } as CSSProperties}
    >
      {metrics.map((metric, i) => (
        <MetricItem key={metric.label} metric={metric} index={i} progress={progress} />
      ))}
    </ul>
  );
}

function MetricItem({ metric, index, progress }: { metric: Metric; index: number; progress: number }) {
  return (
    <li className="rise" style={barDelay(index)}>
      <p className="font-semibold tabular-nums leading-none tracking-[-0.03em] text-[clamp(2.5rem,1.9rem+2.4vw,4rem)]" aria-hidden="true">
        {Math.round(metric.value * progress)}
        <span className="text-[0.5em] align-top text-[var(--brand)]">{metric.unit}</span>
      </p>
      <ProgressTrack
        as="span"
        tint="soft"
        className="mt-4"
        fillClassName="bar-grow"
        fillStyle={{ width: `${metric.value}%`, ...barDelay(index) }}
      />
      <p className="mt-3 t-small text-[var(--dim)] max-w-[30ch]">
        <span className="sr-only">{metric.value}{metric.unit} </span>
        {metric.label}
      </p>
    </li>
  );
}
