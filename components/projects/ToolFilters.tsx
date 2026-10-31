import { projects } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { topTools } from "@/lib/tools";

const FILTERS: [label: string, count: number, tool: string | null][] = [
  ["All", projects.length, null],
  ...topTools(projects).map(([t, n]): [string, number, string] => [t, n, t]),
];

/** "All" plus the tools used most across projects, each with its count; the chosen one is marked by a red square. */
export default function ToolFilters({ tool, onPick }: { tool: string | null; onPick: (tool: string | null) => void }) {
  return (
    <div data-reveal style={revealOrder(2)} className="mt-6 flex flex-wrap md:flex-col gap-x-6 gap-y-3" aria-label="Filter projects by tool">
      {FILTERS.map(([label, n, value]) => (
        <button
          key={label}
          onClick={() => onPick(value)}
          aria-pressed={tool === value}
          className={`flex items-baseline gap-2 whitespace-nowrap transition-colors duration-300 active:scale-95 ${
            tool === value ? "text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--ink)]"
          }`}
        >
          <span className={`inline-block w-2 h-2 self-center transition-[transform,opacity] duration-500 ${tool === value ? "bg-[var(--brand)] scale-100 opacity-100" : "scale-50 opacity-0"}`} aria-hidden="true" />
          {label}
          <span className="t-small tabular-nums">{n}</span>
        </button>
      ))}
    </div>
  );
}
