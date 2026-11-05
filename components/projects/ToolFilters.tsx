import { projects } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { sharedTools } from "@/lib/tools";
import FilterButton from "./FilterButton";

const TOOLS = sharedTools(projects);

export default function ToolFilters({ tool, onPick }: { tool: string | null; onPick: (tool: string | null) => void }) {
  return (
    <div data-reveal style={revealOrder(2)} className="mt-6 flex flex-wrap md:flex-col gap-x-6 gap-y-3" role="group" aria-label="Filter projects by tool">
      <FilterButton label="All" count={projects.length} chosen={tool === null} onPick={() => onPick(null)} />
      {TOOLS.map(([name, count]) => (
        <FilterButton key={name} label={name} count={count} chosen={tool === name} onPick={() => onPick(name)} />
      ))}
    </div>
  );
}
