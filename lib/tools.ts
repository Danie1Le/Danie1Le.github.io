type ToolCount = [tool: string, count: number];

function countTools(projects: { tech: string[] }[]) {
  const counts = new Map<string, number>();
  projects.forEach((project) => project.tech.forEach((tool) => counts.set(tool, (counts.get(tool) ?? 0) + 1)));
  return Array.from(counts);
}

const usedMoreThanOnce = ([, count]: ToolCount) => count > 1;
const alphabetically = ([a]: ToolCount, [b]: ToolCount) => a.localeCompare(b);

export function sharedTools(projects: { tech: string[] }[]): ToolCount[] {
  return countTools(projects).filter(usedMoreThanOnce).sort(alphabetically);
}
