import { projects } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { sharedTools } from "@/lib/tools";

const TOOLS = sharedTools(projects);

/** "All" plus every tool used by more than one project (A to Z), each with its count; the chosen one is marked by a red square. */
export default function ToolFilters({ tool, onPick }: { tool: string | null; onPick: (tool: string | null) => void }) {
  // One render for every button so "All" and the tools always look alike; null is "All".
  const filter = (value: string | null, n: number) => (
    <button
      key={value ?? "All"}
      onClick={() => onPick(value)}
      aria-pressed={tool === value}
      className={`flex items-baseline gap-2 whitespace-nowrap transition-colors duration-300 active:scale-95 ${
        tool === value ? "text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--ink)]"
      }`}
    >
      <span className={`inline-block w-2 h-2 self-center transition-[transform,opacity] duration-500 ${tool === value ? "bg-[var(--brand)] scale-100 opacity-100" : "scale-50 opacity-0"}`} aria-hidden="true" />
      {value ?? "All"}
      <span className="t-small tabular-nums">{n}</span>
    </button>
  );

  return (
    <div data-reveal style={revealOrder(2)} className="mt-6 flex flex-wrap md:flex-col gap-x-6 gap-y-3" role="group" aria-label="Filter projects by tool">
      {filter(null, projects.length)}
      {TOOLS.map(([t, n]) => filter(t, n))}
    </div>
  );
}
