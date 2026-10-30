/**
 * The tools that recur across projects, most used first, with how many projects use each: the project filters.
 * A tool used by only one project is left out (filtering to a single row is no help).
 */
export function topTools(projects: { tech: string[] }[], limit = 6): [tool: string, count: number][] {
  const counts = new Map<string, number>();
  projects.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return Array.from(counts).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, limit);
}
