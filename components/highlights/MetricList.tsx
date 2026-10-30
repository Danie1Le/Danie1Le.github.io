import { useCountUp } from "@/hooks/useCountUp";
import type { Metric } from "@/lib/content";
import { animDelay } from "@/lib/motion";

const stagger = (i: number) => animDelay(0.08 + i * 0.07);

/**
 * Spec-row pattern (as on Apple and Ferrari spec sheets): every figure at once, counting up, each over a bar sized
 * to its percentage. Remount it to replay the count.
 */
export default function MetricList({ metrics }: { metrics: Metric[] }) {
  const t = useCountUp();
  return (
    <ul
      className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-x-8 gap-y-8"
      style={{ "--n": metrics.length } as React.CSSProperties}
    >
      {metrics.map((metric, i) => (
        <li key={metric.label} className="rise" style={stagger(i)}>
          <p className="font-semibold tabular-nums leading-none tracking-[-0.03em] text-[clamp(2.5rem,1.9rem+2.4vw,4rem)]" aria-hidden="true">
            {Math.round(metric.value * t)}
            <span className="text-[0.5em] align-top text-[var(--brand)]">{metric.unit}</span>
          </p>
          <span className="mt-4 block h-[3px] bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]" aria-hidden="true">
            <span className="bar-grow block h-full bg-[var(--brand)]" style={{ width: `${metric.value}%`, ...stagger(i) }} />
          </span>
          <p className="mt-3 t-small text-[var(--dim)] max-w-[30ch]">
            <span className="sr-only">{metric.value}{metric.unit} </span>
            {metric.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
