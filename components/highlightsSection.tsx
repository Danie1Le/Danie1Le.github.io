"use client"

import { highlights } from "@/lib/data";
import { useEffect, useRef, useState } from "react";

const W = 1600;
const TAU = Math.PI * 2;
// The band shows the middle of each 1600×900 drawing (about y 318–582 on desktop), so everything is drawn there.
const MID = 450;

type ArtProps = { onDone: () => void };

// The red sweep that times each role: when it reaches the right edge the first time, the panel moves on.
function Sweep({ y, h, onDone }: ArtProps & { y: number; h: number }) {
  return (
    <rect className="art-scan" x={0} y={y} width={4} height={h} fill="var(--brand)" opacity={0.85}
      onAnimationEnd={(e) => e.animationName === "scan" && onDone()} />
  );
}

// Framatome: three rows of document pages; as the scan passes, the ones with page-number errors flag red.
function Pages({ onDone }: ArtProps) {
  const cols = 20, rows = 3, pw = 56, ph = 72, gx = 20, gy = 18;
  const x0 = (W - (cols * pw + (cols - 1) * gx)) / 2, y0 = MID - (rows * ph + (rows - 1) * gy) / 2;
  const flagged = new Set([3, 26, 32, 51]);
  return (
    <g>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = x0 + (i % cols) * (pw + gx);
        // Flag a page at the moment the 6s sweep crosses its middle.
        const at = { "--d": `${(((x + pw / 2) / W) * 6).toFixed(2)}s` } as React.CSSProperties;
        return (
          <g key={i} transform={`translate(${x} ${y0 + Math.floor(i / cols) * (ph + gy)})`}>
            <rect width={pw} height={ph} fill="currentColor" opacity={0.07} />
            {flagged.has(i) && <rect className="art-flag" width={pw} height={ph} fill="var(--brand)" style={at} />}
            {[12, 22, 32, 42].map((y, j) => (
              <rect key={y} x={10} y={y} width={pw - 20 - ((i + j) % 3) * 8} height={3} fill="currentColor" opacity={0.16} />
            ))}
            <rect x={pw / 2 - 5} y={ph - 12} width={10} height={4} fill="currentColor" opacity={0.3} />
          </g>
        );
      })}
      <Sweep y={y0 - 10} h={rows * ph + (rows - 1) * gy + 20} onDone={onDone} />
    </g>
  );
}

// EEG research: six channels of signal streaming past, one picked out in red, read by a sweeping cursor.
// Each trace uses whole-number cycles per width, so shifting by one width loops seamlessly.
function Signal({ onDone }: ArtProps) {
  const trace = (c: number) => {
    let d = "";
    for (let x = 0; x <= W * 2; x += 8) {
      const t = x / W;
      const y = MID - 100 + c * 40 + 10 * Math.sin(TAU * 7 * t + c * 1.3) + 6 * Math.sin(TAU * 23 * t + c * 2.1) + 3 * Math.sin(TAU * 61 * t + c);
      d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    return d;
  };
  return (
    <g>
      <g className="art-stream">
        {Array.from({ length: 6 }, (_, c) => (
          <path key={c} d={trace(c)} fill="none" stroke={c === 2 ? "var(--brand)" : "currentColor"} strokeWidth={c === 2 ? 2.5 : 1.5} opacity={c === 2 ? 0.9 : 0.22} />
        ))}
      </g>
      <Sweep y={MID - 125} h={250} onDone={onDone} />
    </g>
  );
}

// ResVR: avatar videos rendering under a playhead; the new render bar is 38% the length of the old one (62% less time).
function Render({ onDone }: ArtProps) {
  const x0 = 160, full = 1280;
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={x0 + i * 130} y={MID - 110} width={114} height={60} fill="currentColor" opacity={0.08} />
      ))}
      <rect x={x0} y={MID - 15} width={full} height={30} fill="currentColor" opacity={0.12} />
      <rect className="art-grow" x={x0} y={MID + 35} width={full * 0.38} height={30} fill="var(--brand)" opacity={0.85} />
      <Sweep y={MID - 120} h={80} onDone={onDone} />
    </g>
  );
}

// Cognitive ABM: a population of agents and the best fitness climbing over generations.
function Fitness({ onDone }: ArtProps) {
  const curve = Array.from({ length: 61 }, (_, g) => {
    const x = 160 + g * 21.33;
    const y = MID + 100 - 200 * (1 - Math.exp(-g / 10)) - 4 * Math.sin(g * 1.7);
    return `${x.toFixed(0)},${y.toFixed(0)}`;
  }).join(" ");
  return (
    <g>
      {Array.from({ length: 90 }, (_, i) => (
        <circle key={i} cx={(i * 173.3) % W} cy={MID - 115 + ((i * 97) % 230)} r={4} fill="currentColor" opacity={0.14} />
      ))}
      <polyline className="art-draw" points={curve} pathLength={1} fill="none" stroke="var(--brand)" strokeWidth={3} />
      <Sweep y={MID - 125} h={250} onDone={onDone} />
    </g>
  );
}

const ART = { pages: Pages, signal: Signal, render: Render, fitness: Fitness };

// Spec-row pattern (as on Apple and Ferrari spec sheets): every figure for the chosen role is visible at once,
// with a bar sized to its percentage. Picking a role is instant; otherwise each role's red sweep hands on to the next.
export default function HighlightsSection() {
  const [g, setG] = useState(0);
  const [seen, setSeen] = useState(false); // replay the count-up when the panel first comes into view
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [t, setT] = useState(1); // count-up progress, 0 → 1
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { threshold: 0.35 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(1);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      setT(1 - Math.pow(1 - k, 4));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    setT(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [g, seen]);

  const group = highlights[g];
  const next = () => !reduce && setG((i) => (i + 1) % highlights.length);
  const delay = (i: number) => ({ "--d": `${0.08 + i * 0.07}s` }) as React.CSSProperties;

  return (
    <section id="highlights" ref={sectionRef} className="frame pt-8">
      <div className="bg-[var(--surface)] transition-colors duration-500">
        <div className="p-6 md:p-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <h2 className="t-lead font-medium">Numbers from the work</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 t-small" role="group" aria-label="Choose a role">
            {highlights.map((item, i) => (
              <button
                key={item.where}
                aria-pressed={i === g}
                onClick={() => setG(i)}
                className={`link min-h-11 transition-colors ${i === g ? "text-[var(--ink)] underline decoration-[var(--brand)]" : "text-[var(--dim)] hover:text-[var(--ink)]"}`}
              >
                {item.where}
              </button>
            ))}
          </div>
        </div>

        {/* The drawing of the chosen role's work, in its own band so it never sits behind text. */}
        <div className="relative h-40 md:h-56 overflow-hidden" aria-hidden="true" data-offscreen={!visible || undefined}>
          {highlights.map((item, i) => {
            const Art = ART[item.art as keyof typeof ART];
            return (
              <svg
                key={item.art}
                viewBox="0 0 1600 900"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out"
                style={{ opacity: i === g ? 1 : 0 }}
              >
                {/* Remount on activation so each drawing starts its motion fresh. */}
                {i === g && <Art key={`${g}-${seen}`} onDone={next} />}
              </svg>
            );
          })}
        </div>

        <ul
          key={`${g}-${seen}`}
          className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-x-8 gap-y-8"
          style={{ "--n": group.metrics.length } as React.CSSProperties}
        >
          {group.metrics.map((metric, i) => (
            <li key={metric.label} className="rise" style={delay(i)}>
              <p className="font-semibold tabular-nums leading-none tracking-[-0.03em] text-[clamp(2.5rem,1.9rem+2.4vw,4rem)]" aria-hidden="true">
                {Math.round(metric.value * t)}
                <span className="text-[0.5em] align-top text-[var(--brand)]">{metric.unit}</span>
              </p>
              <span className="mt-4 block h-[3px] bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]" aria-hidden="true">
                <span className="bar-grow block h-full bg-[var(--brand)]" style={{ width: `${metric.value}%`, ...delay(i) }} />
              </span>
              <p className="mt-3 t-small text-[var(--dim)] max-w-[30ch]">
                <span className="sr-only">{metric.value}{metric.unit} </span>
                {metric.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
